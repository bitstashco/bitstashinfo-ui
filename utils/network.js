export default {
  mainnet: {
    pubkey: 0x19,
    pubkeyhash: 0x19,
    scripthash: 0x32,
    witness_v0_keyhash: 'bs',
    witness_v0_scripthash: 'bs'
  },
  testnet: {
    pubkey: 0x78,
    pubkeyhash: 0x78,
    scripthash: 0x6e,
    witness_v0_keyhash: 'tb',
    witness_v0_scripthash: 'tb'
  }
}[process.env.network || 'mainnet']
