import React, { useContext } from 'react'

import { Layout, SEO, Terminal } from '@components'
import { TabContext } from '@context/TabContext'

const IndexPage: React.FC = () => {
  const tabContext = useContext(TabContext)

  return (
    <Layout>
      <SEO title="Home" />
      {tabContext.state.tabs.map(tab => {
        if (tab.type === 'terminal') {
          return (
            <Terminal
              id={tab.id}
              isMax={tab.isMaximized}
              initial={{ width: 680, height: 480, top: 50, left: 50 }}
            />
          )
        }
        return null
      })}
    </Layout>
  )
}

export default IndexPage
