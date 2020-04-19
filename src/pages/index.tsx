import React, { useContext } from 'react'

import { Layout, SEO, Terminal } from '@components'

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Terminal initial={{ width: 680, height: 480, top: 50, left: 50 }} />
    </Layout>
  )
}

export default IndexPage
