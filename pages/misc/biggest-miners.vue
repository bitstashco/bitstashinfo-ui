<template>
  <div class="container">
    <Panel width="100%" title="Staking Overview" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul>
            <li class="border">
              <div class="item-title">Network Weight</div>
              <div class="item-info">{{this.netStakeWeight | bitstash(8)}}</div>
            </li>
            </li>
            <li class="border">
              <div class="item-title">ROI</div>
              <div
                class="item-info"
              >{{ (reward * 365 * 675 / this.netStakeWeight * 100).toFixed(2) }}%</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li>
              <div class="item-title">Block Reward</div>
              <div class="item-info">35.7 Stash</div>
            </li>
            <li>
              <div class="item-title">Annual Inflation Rate</div>
              <div class="item-info"> ...%</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" title="Staking Rankings">
        <table>
          <thead>
            <tr>
              <td>Ranking</td>
              <td>Address</td>
              <td>Block Mined</td>
              <td>Percentage</td>
              <td>Balance (Stash)</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in list">
              <td>{{index+1}}</td>
              <td>
                <nuxt-link :to="{name: 'address-id', params: {id: item.address}}">{{item.address}}</nuxt-link>
              </td>
              <td>{{item.blocks}}</td>
              <td>{{ (item.blocks / posBlocks * 100).toFixed(4) + '%' }}</td>
              <td>{{ item.balance | bitstash(8) }}</td>
            </tr>
          </tbody>
        </table>
        <pagination />
      </Panel>
    </div>
  </div>
</template>
<script>
import Misc from "@/models/misc";
import Pagination from "@/components/pagination";
import { RequestError } from "@/services/bitstashinfo-api";
import { scrollIntoView } from "@/utils/dom";
import Panel from "../../components/panel";
export default {
  components: { Panel, Pagination },
  head() {
    return {
      title: this.$t("misc.biggest_miners_title")
    };
  },
  data() {
    return {
      totalCount: 0,
      list: [],
      currentPage: Number(this.$route.query.page || 1),
      netStakeWeight: 0
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect("/misc/biggest-miners");
      }
      let page = Number(query.page || 1);
      let { totalCount, list } = await Misc.biggestMiners(
        { from: (page - 1) * 100, to: page * 100 },
        { ip: req && req.ip }
      );
      let { netStakeWeight } = await Misc.info({ ip: req && req.ip });
      if (page > 1 && totalCount <= (page - 1) * 100) {
        redirect("/misc/biggest-miners", { page: Math.ceil(totalCount / 100) });
      }
      console.log(list);
      return { totalCount, list, netStakeWeight };
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    blockchain() {
      return this.$store.state.blockchain;
    },
    posBlocks() {
      return this.blockchain.height - 5000;
    },
    pages() {
      return Math.ceil(this.totalCount / 100);
    },
    reward() {
      let height = this.blockchain.height - 5001;
      let interval = 985500;
      let halvings = Math.floor(height / interval);
      return halvings === 7 ? 0 : 4e8 >>> halvings;
    }
  },
  methods: {
    getLink(page) {
      return { name: "misc-biggest-miners", query: { page } };
    }
  },
  async beforeRouteUpdate(to, from, next) {
    let page = Number(to.query.page || 1);
    let { totalCount, list } = await Misc.biggestMiners({
      from: (page - 1) * 100,
      to: page * 100
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "misc-biggest-miners",
        query: { page: Math.ceil(totalCount / 100) }
      });
      return;
    }
    this.list = list;
    this.currentPage = page;
    next();
    scrollIntoView(this.$refs.section);
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/pages/misc/biggest-miners.less");
</style>
