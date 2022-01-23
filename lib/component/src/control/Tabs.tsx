import { Tab as TabGrommet, Tabs as TabsGrommet } from 'grommet'
import type { TabExtendedProps } from 'grommet'
import { Icon, IconName } from '@component'
import React from 'react'

interface TabProps {
  title: TabExtendedProps['title']
  icon?: IconName
}

const Tab: React.FC<TabProps> = (props) => {
  const { title, icon } = props
  return (
    <TabGrommet title={title} icon={icon ? <Icon name={icon} /> : undefined}>
      {props.children}
    </TabGrommet>
  )
}

const Tabs: React.FC = (props) => {
  return <TabsGrommet>{props.children}</TabsGrommet>
}

export { Tab, Tabs }
