import { DraggablePanel } from '@/components'
import { WebuiSetting } from '@/components/Header/Setting'
import { useAppStore } from '@/store'
import { ZoomInOutlined } from '@ant-design/icons'
import { useLocalStorageState } from 'ahooks'
import { Slider } from 'antd'
import { useResponsive } from 'antd-style'
import React, { CSSProperties, useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { shallow } from 'zustand/shallow'

const GlobalStyle = createGlobalStyle`
  button#txt2img_extra_networks,
  button#img2img_extra_networks {
    display: none !important;
  }
`

const View = styled.div`
  display: flex;
  flex-direction: column;
  height: -webkit-fill-available;
  overflow: hidden;
`

const SidebarView = styled.div<{ size: number }>`
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;

  #txt2img_extra_networks,
  #img2img_extra_networks {
    display: block !important;
  }

  .extra-network-thumbs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${({ size }) => size}px, 1fr));
    > .card {
      height: ${({ size }) => size * 1.5}px !important;
      width: -webkit-fill-available !important;
    }
  }
`

const Footer = styled.div`
  flex: 0;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top: 1px solid var(--color-border);
`

const ZoomSlider = styled(Slider)`
  margin-left: 16px;
  flex: 1;
`

interface SidebarProps {
  children: React.ReactNode
  loading?: boolean
  style?: CSSProperties
}

const Sidebar: React.FC<SidebarProps> = ({ children, style }) => {
  const { mobile } = useResponsive()
  const [currentTab] = useAppStore((st) => [st.currentTab], shallow)
  const [setting] = useLocalStorageState<WebuiSetting>('SD-KITCHEN-SETTING')
  const [expand, setExpand] = useLocalStorageState<boolean>('SD-KITCHEN-EXTRA-SIDEBAR', {
    defaultValue: true,
  })
  const [size, setSize] = useState<number>(setting?.extraNetworkCardSize || 86)

  useEffect(() => {
    if (currentTab && !['tab_txt2img', 'tab_img2img'].includes(currentTab)) {
      setExpand(false)
    }
  }, [currentTab])

  useEffect(() => {
    if (mobile) setExpand(false)
  }, [])

  return (
    <>
      <GlobalStyle />
      <DraggablePanel
        maxHeight
        style={style}
        placement="right"
        defaultSize={{ width: setting?.extraNetworkSidebarWidth || 340 }}
        isExpand={expand}
        onExpandChange={setExpand}
      >
        <View>
          <SidebarView size={size}>{children}</SidebarView>
          <Footer>
            <ZoomInOutlined />
            <ZoomSlider defaultValue={size} step={8} max={256} min={64} onChange={setSize} />
          </Footer>
        </View>
      </DraggablePanel>
    </>
  )
}

export default React.memo(Sidebar)
