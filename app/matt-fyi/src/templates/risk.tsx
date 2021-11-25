import * as React from 'react'
// import { graphql } from 'gatsby'
// import type { PageProps } from 'gatsby'
// import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FunctionComponent } from 'react'
// import { MDXProvider } from '@mdx-js/react'

const IndexPage: FunctionComponent = (): JSX.Element => {
  return <div>risks page</div>
}
// const IndexPage: FunctionComponent<PageProps<GatsbyTypes.RisksQueryQuery>> = ({ data }): JSX.Element => {
//   return (
//     <main>
//       <MDXProvider components={{}}>
//         {data.store.risks.map((r) => (
//           <>
//             <p key={r?.id}>Risk: {r?.id}</p>
//             <ul>
//               <li>Name: {r?.name}</li>
//               <li>Notes: {r?.notes && <MDXRenderer>{r.notes}</MDXRenderer>}</li>
//               <li>
//                 Children ({r?.children?.length}):{' '}
//                 {r?.children?.length && (
//                   <ul>
//                     {r.children.map((c) => (
//                       <>
//                         <p key={c?.id}>Risk: {c?.id}</p>
//                         <ul key={c?.id}>
//                           <li>name: {c?.name}</li>
//                           <li>
//                             notes:
//                             {c?.notes && <MDXRenderer>{c.notes}</MDXRenderer>}
//                           </li>
//                         </ul>
//                       </>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             </ul>
//           </>
//         ))}
//       </MDXProvider>
//     </main>
//   )
// }

// export const query = graphql`
//   query RisksQuery {
//     store {
//       risks {
//         id
//         name
//         notes
//         children {
//           id
//           name
//           category
//           notes
//         }
//       }
//     }
//   }
// `
export default IndexPage
