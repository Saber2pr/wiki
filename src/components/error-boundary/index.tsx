import './style.less'

import React from 'react'

export type ErrorInfo = { componentStack: string }
export type Error = { message?: string; stack?: string }

export class ErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error?: Error; info?: ErrorInfo }
> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true, error, info })
  }

  render() {
    if (this.state.hasError) {
      console.log('err', this.state)
    }
    return this.props.children
  }
}
