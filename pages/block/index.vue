<template>
  <div class="container">
    <Panel width="100%" title="Block list">
      <table>
        <thead>
          <tr>
            <td>Height</td>
            <td>Time</td>
            <td>Number of Transaction</td>
            <td>Block Size</td>
            <td>Miner Address</td>
            <td>Block Reward</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{height, timestamp, size, reward, miner, transactionCount} of list">
            <td>
              <div class="frame">
                BK
                <nuxt-link :to="{name: 'block-id', params: {id: height }}">{{height}}</nuxt-link>
              </div>
            </td>
            <td>
              <FromNow :timestamp="timestamp" />
            </td>
            <td>{{ transactionCount}}</td>
            <td>{{ size.toLocaleString() }}</td>
            <td>
              <nuxt-link :to="{name: 'address-id', params: {id: miner}}">{{miner}}</nuxt-link>
            </td>
            <td>{{ reward | bitstash(1) }}</td>
          </tr>
        </tbody>
      </table>
      <pagination />
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Block from "@/models/block";
import { RequestError } from "@/services/bitstashinfo-api";
import { scrollIntoView } from "@/utils/dom";
import Pagination from "../../components/pagination";

function formatUTCTimestamp(date) {
  let yyyy = date.getUTCFullYear().toString();
  let mm = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  let dd = date
    .getUTCDate()
    .toString()
    .padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

export default {
  components: { Panel, Pagination },
  head() {
    return {
      title: this.$t("block.list.block_list")
    };
  },
  data() {
    return {
      list: [],
      date: ""
    };
  },
  async asyncData({ req, query, redirect, error }) {
    let date = query.date && new Date(query.date);
    try {
      let list = await Block.getRecentBlocks({
        params: {
          count: 20
        },
        ip: req && req.ip
      });
      return { list };
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
    }
  },
  watch: {
    // async "blockchain.height"(height) {
    //   if (height === this.list[0].height + 1) {
    //     let block = await Block.get(height);
    //     let todayTimestamp = Date.parse(this.date + "T00:00:00") / 1000;
    //     if (
    //       block.timestamp >= todayTimestamp &&
    //       block.timestamp < todayTimestamp + 60 * 60 * 24
    //     ) {
    //       this.list.unshift({
    //         hash: block.hash,
    //         height: block.height,
    //         timestamp: block.timestamp,
    //         interval: block.interval,
    //         size: block.size,
    //         transactionCount: block.transactions.length,
    //         miner: block.miner,
    //         reward: block.reward
    //       });
    //     }
    //   } else {
    //     this.list = await Block.getBlocksByDate(this.date);
    //   }
    //}
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/pages/block/index.less");
</style>
