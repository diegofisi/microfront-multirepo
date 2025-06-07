export interface NewsItem {
  id: number
  bank: string
  title: string
  summary: string
  impact: 'positive' | 'negative' | 'neutral'
  timestamp: Date
  readTime: string
}

export interface User {
  id: string | number
  name: string
  email?: string
  avatar?: string
}

export interface IframeReadyData {
  width: number
  height: number
}

export interface NewsSelectedData {
  id: number
  title: string
  bank: string
  impact: 'positive' | 'negative' | 'neutral'
  timestamp: Date
}

export interface NewsRefreshedData {
  count: number
  timestamp: Date
}

export type PostMessageData = 
  | {
      type: 'IFRAME_READY'
      data: IframeReadyData
    }
  | {
      type: 'NEWS_SELECTED'
      data: NewsSelectedData
    }
  | {
      type: 'NEWS_REFRESHED'
      data: NewsRefreshedData
    }
  | {
      type: 'THEME_CHANGE'
      theme: 'light' | 'dark'
    }
  | {
      type: 'USER_INFO'
      user: User
    }