import { Tab as TabGrommet, Tabs as TabsGrommet } from 'grommet'
import type { TabExtendedProps } from 'grommet'
import { Icon, IconName } from '@component'
import React from 'react'
import { BaseProps, setTestId } from '@component/Base'

interface TabProps extends BaseProps {
  title: TabExtendedProps['title']
  icon?: IconName
  testId: string // Make required for control components
}

const Tab: React.FC<TabProps> = (props) => {
  const { title, icon, testId, ...forwardedProps } = props
  return (
    <TabGrommet
      {...forwardedProps}
      title={title}
      icon={icon ? <Icon name={icon} /> : undefined}
      {...setTestId('Tab', testId)}
    >
      {props.children}
    </TabGrommet>
  )
}

const Tabs: React.FC<BaseProps> = (props) => {
  const { testId, ...forwardedProps } = props
  return (
    <TabsGrommet {...forwardedProps} {...setTestId('Tabs', testId)}>
      {props.children}
    </TabsGrommet>
  )
}

export { Tab, Tabs }
