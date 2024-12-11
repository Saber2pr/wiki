import './style.less'

import React, { memo } from 'react'

import {
  ErrorBack,
  LazyCom,
  Loading,
  TwoSide,
  useOption,
} from '../../components'
import { request, requestContent } from '../../request'
import { origin } from '../../config'

const Main = ({ content }: { content: string }) => {
  const [model, show] = useOption()
  return (
    <>
      <h1 className="About-Main-Title">About Me</h1>
      <div className="About-Main-Content">
        <div>{content}</div>
        <hr className="About-Hr" />
        <div>
          {model}
          <button className="ButtonHigh" onClick={() => show()}>
            附加选项
          </button>
        </div>
      </div>
    </>
  )
}

export interface About {
  projects: Array<{ name: string; href: string; content: string }>
}

export const About = ({ projects }: About) => (
  <div className="About">
    <TwoSide>
      <section className="About-Main">
        <LazyCom
          fallback={<Loading type="line" />}
          await={requestContent(origin.data.aboutmd)}
          errorBack={<ErrorBack />}
        >
          {content => <Main content={content} />}
        </LazyCom>
      </section>
      <aside className="About-Aside">
        <h2 className="About-Aside-Title">Projects</h2>
        <ul className="About-Aside-Content">
          {projects.map(({ name, href, content }) => (
            <li key={name} className="About-Aside-Content-Proj">
              <a href={href}>{name}</a>
              <p>{content}</p>
            </li>
          ))}
        </ul>
      </aside>
    </TwoSide>
  </div>
)

export const AboutLazy = memo(() => (
  <LazyCom await={request('about')} fallback={<Loading type="block" />}>
    {res => <About {...res} />}
  </LazyCom>
))
