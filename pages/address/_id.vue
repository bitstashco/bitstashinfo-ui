<template>
  <div class="container">
    <Panel width="100%" height="255px" title="Transaction overview" noMargin="true">
      <div class="address-info">
        <div class="address-info-left list">
          <ul class="border">
            <li>
              <div class="item-title">BitStash Balance</div>
              <div class="item-info">{{ balance | bitstash }} STASH</div>
            </li>
            <li >
              <div class="item-title">Mining Locked Amount</div>
              <div class="item-info">{{ staking | bitstash }} STASH</div>
            </li>
            <li>
              <div class="item-title">Token Balance</div>
              <div class="item-info"></div>
            </li>
            <li>
              <div class="item-title">Optional</div>
              <div class="item-info"></div>
            </li>
          </ul>
        </div>
        <div class="address-info-right list">
          <ul>
            <li>
              <div class="item-title">Rank</div>
              <div class="item-info">{{ ranking }}</div>
            </li>
            <li>
              <div class="item-title">Number of Transactions</div>
              <div class="item-info">{{ transactionCount }}</div>
            </li>
            <li>
              <div class="item-title">Total Income</div>
              <div class="item-info">{{ totalReceived | bitstash }} STASH</div>
            </li>
            <li>
              <div class="item-title">Total Expenditure</div>
              <div class="item-info">{{ totalSent | bitstash }} STASH</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>
    <Panel width="100%" :address="address" class="address-detail">
      <nuxt-child></nuxt-child>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Address from "@/models/address";
import Transaction from "@/models/transaction";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("blockchain.address") + " " + this.id
    };
  },
  middleware: "check-address",
  data() {
    return {
      balance: "0",
      totalReceived: "0",
      totalSent: "0",
      unconfirmed: "0",
      staking: "0",
      qrc20Balances: [],
      ranking: 0,
      blocksMined: 0,
      transactionCount: 0,
      address: [
        {
          link: "address-id",
          name: "Tx details",
          id: this.$route.params.id
        },
        {
          link: "address-id-balance",
          name: "Balance Chng",
          id: this.$route.params.id
        }
      ]
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      let address = await Address.get(params.id, { ip: req && req.ip });
      return address;
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    addresses() {
      let result = [];
      for (let address of this.id.split(",")) {
        if (!result.includes(address)) {
          result.push(address);
        }
      }
      return result;
    },
    existingTokenBalances() {
      return this.qrc20Balances.filter(token => token.balance !== "0");
    },
    myAddresses() {
      return this.$store.state.address.myAddresses;
    }
  },
  methods: {
    addMyAddress(address) {
      this.$store.commit("address/my-addresses/add", address);
    },
    removeMyAddress(address) {
      this.$store.commit("address/my-addresses/remove", address);
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../styles/pages/address/_id.less');
</style>
