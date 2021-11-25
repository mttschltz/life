// From https://github.com/gatsbyjs/gatsby/blob/master/examples/creating-source-plugins/source-plugin/gatsby-node.js
const { createRemoteFileNode, createFileNodeFromBuffer } = require(`gatsby-source-filesystem`)
const WebSocket = require('ws')
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client/core')
// const { ApolloClient } = require('apollo-client')
// const { InMemoryCache } = require('apollo-cache-inmemory')
const { split } = require('apollo-link')
// const { HttpLink } = require('apollo-link-http')
const { WebSocketLink } = require('apollo-link-ws')
const { getMainDefinition } = require('apollo-utilities')
const fetch = require('node-fetch')
const base64js = require('base64-js')
// const gql = require('graphql-tag')

/**
 * ============================================================================
 * Create a GraphQL client to subscribe to live data changes
 * ============================================================================
 */

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
  fetch,
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
  },
  webSocketImpl: WebSocket,
})

// using the ability to split links, you can send data to each link/url
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

/**
 * ============================================================================
 * Helper functions and constants
 * ============================================================================
 */

const RISK_NODE_TYPE = `Risk`
const AUTHOR_NODE_TYPE = `Author`

// helper function for creating nodes
const createNodeFromData = (item, nodeType, helpers) => {
  const nodeMetadata = {
    id: helpers.createNodeId(`${nodeType}-${item.id}`),
    parent: null, // this is used if nodes are derived from other nodes, a little different than a foreign key relationship, more fitting for a transformer plugin that is changing the node
    children: [],
    internal: {
      type: nodeType,
      content: JSON.stringify(item),
      contentDigest: helpers.createContentDigest(item),
    },
  }

  const node = Object.assign({}, item, nodeMetadata)
  helpers.createNode(node)
  return node
}

/**
 * ============================================================================
 * Verify plugin loads
 * ============================================================================
 */

// should see message in console when running `gatsby develop` in example-site
exports.onPreInit = () => console.log('Loaded external-mdx')

/**
 * ============================================================================
 * Link nodes together with a customized GraphQL Schema
 * ============================================================================
 */

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type RiskMdx implements Node {
      id: ID!
      notesMdx: String
    }`)
}

/**
 * ============================================================================
 * Source and cache nodes from the API
 * ============================================================================
 */

exports.sourceNodes = async function sourceNodes(
  { actions, cache, createContentDigest, createNodeId, getNodesByType, getNode, store },
  pluginOptions,
) {
  const { createNode, touchNode, deleteNode } = actions
  const helpers = Object.assign({}, actions, {
    createContentDigest,
    createNodeId,
  })

  // you can access plugin options here if need be
  console.log(`Space ID: ${pluginOptions.spaceId}`)

  // simple caching example, you can find in .cache/caches/source-plugin/some-diskstore
  await cache.set(`hello`, `world`)
  console.log(await cache.get(`hello`))

  // touch nodes to ensure they aren't garbage collected
  getNodesByType(RISK_NODE_TYPE).forEach((node) => touchNode(node))
  // getNodesByType(AUTHOR_NODE_TYPE).forEach((node) => touchNode(node))

  // listen for updates using subscriptions from the API
  if (pluginOptions.preview) {
    console.log('Subscribing to updates on ws://localhost:4000 (plugin is in Preview mode)')
    const subscription = await client.subscribe({
      query: gql`
        subscription {
          risks {
            id
            notes
          }
        }
      `,
    })
    subscription.subscribe(({ data }) => {
      console.log(`Subscription received:`)
      console.log(data.risks)
      data.risks.forEach((risk) => {
        const nodeId = createNodeId(`${RISK_NODE_TYPE}-${risk.id}`)
        createNodeFromData(risk, RISK_NODE_TYPE, helpers)
      })
    })
  }

  // store the response from the API in the cache
  const cacheKey = 'your-source-data-key'
  let sourceData = await cache.get(cacheKey)

  // fetch fresh data if nothing is found in the cache or a plugin option says not to cache data
  if (!sourceData || !pluginOptions.cacheResponse) {
    console.log('Not using cache for source data, fetching fresh content')
    const { data } = await client.query({
      query: gql`
        query {
          risks {
            id
            notes
          }
        }
      `,
    })
    await cache.set(cacheKey, data)
    sourceData = data
  }

  // loop through data returned from the api and create Gatsby nodes for them
  // TODO:
  // 0. Ensure test image below can be rendered in a gatsby post
  // 0. (use a larger image) Ensure test image below can be resized etc with remark images plugin for mdx
  // 1. Neaten and commit this change with basic plugins, etc.
  // 2. Test that I can use mdx/images locally (santiy chekc) then test using remark plugin to replace that image with the test one below
  // 3. Update risk return model to include array of images with name.extension + content
  // 4. Content: Send an array of images for notes + a link to one of them in the MDX
  // 5. Gatsby: When pulling images down, modify the name to be unique AND do a find/replace in the mdx to use the same new name (removing folders, etc)
  // 6. Content: Create a content folder, with a test-post subfolder... ensure it displays locally in VSCode
  // 7. Gatsby: Finish the whole process
  //
  // Notes on how createRemoteFileNode creates nodes:
  // Let's see how createRemoteFileNode does it https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-filesystem/src/create-remote-file-node.js
  // Calls fetchRemoteFile in gatsby-core-utils https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-core-utils/src/fetch-remote-file.ts
  // This creates a file and moves it to a path created by createFilePath. It returns that file path so I guess it can be found later.
  // File node object is then created with internal createFileNode function, with the filename (not actually added to redux store or whatever)
  // Then node is actually created with createNode and the objecet created in last step
  // OOOOR.. just use the buffer: https://github.com/gatsbyjs/gatsby/edit/master/packages/gatsby-source-filesystem/src/create-file-node-from-buffer.js
  await createFileNodeFromBuffer({
    buffer: Buffer.from('test message'),
    store: store,
    cache: cache,
    // getCache: ctx.getCache,
    createNode: createNode,
    createNodeId: createNodeId,
    ext: '.mdx',
    name: 'risk-',
  })
  // TODO: Modify name to include full, unique path.
  const fileSystemNode = await createFileNodeFromBuffer({
    buffer: Buffer.from(
      base64js.toByteArray(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhYZGRgaHBocHBwaHBgcGh8cGhoZGhoaGh4cIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHhISHzQrJCw0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIANkA6AMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAACAQMEBQYAB//EAD4QAAEDAgQEAwcDAgUCBwAAAAEAAhEDIQQSMUEFUWFxgZGhBhMiMrHB8ELR4XKyFFJikvGCwgcjM0Ois9L/xAAZAQACAwEAAAAAAAAAAAAAAAAAAQIDBAX/xAAkEQACAgICAgIDAQEAAAAAAAAAAQIRAyESMQRBIlETMmFCM//aAAwDAQACEQMRAD8AyjDOqXKNZTWbdGHCCuK0ZDnEnRCGlHScG9UEygYhcINkIbKOmwbLiDKdgIGQia2AQN1xfFiEDjuCjYjiIsN1zWkCEmfqhc6UxjwcRtZAH9EheVxq9EJDDcwi5XB50jVAH81zDdKvsA3CDJuka4zOgQva68XSSTAToQT3CbI3OEJamHLNfRMHsih0HTI0lPsoOe4MYC5xMADUkpmlh3PcA0SToB3hb7gnCxhmwYNVw+J3+QH9IPbVSUG2X4sEpv8AgPCvZ+nRbNQ53m5uco6CNfos17T4fJVzAfA8BwP1HnPmtniaoFgVmvbEfBStc+87wMqtklVGrPgjHFaMs95snHhoKaZfVdBdYKmjnBucOy5zbC91wGx2SOMjTRIQrCBZK90aaJskRfVNOdG+qajbEPEDZcm3CIXJ0MlMG0WS5QlNxqlptsq2/YgHAmNkT3RsucSD0XQDMIHQ055iYStfyXEbFK9l+SegBNW90ghOBqQmUWvQAQOSG0lORdEaYzidDqmqBFrgOBNqNBfUyFwkCAT0zXHe2yexHsdWAmk9lUDZvwv/ANp+xKsmMbmd1J+tlNw9cNPzactvIq5JPR134keKMLiKLmOyPYWvGzgQfIpvMeUz+8L0irim1BlqsZUaP8zXEj+lwu1VuL4DTe0uw3zAS6m4yTr8joudbHWE1iTZml4jXT0ZSjhHuGYC2/ROVcO1mVxl2bl3v9CpNHEkvAY6AHS4EbAnM0iNdAmOKMDqYfROYNMvYN4E5o25FWxxxTJx8eMVbJGHpU32JcbWIuJvr0/ZRH4VmUlxIIJtadx/2+qHhnxZzTkva5r2DeJuD6eBT3HcSRiaZDBke1tzuXh1xyiFNwj9Eljj7Rd+yVEMpOr6lzi2npIAMOd0M6dlomPaGy7U9blVfBWOZRp0yQcmZuYACxcTpuevRWbsMQOfn9hb6qtVejVGKjFIYfls4iOiofbepDaLQdQ8x4tH2V38DHf+a6J0Cz/tzRh9F4JILCBIiADP/clNaZT5f/My7nmwRZCQUIuUbDzsFmZyWCQUrXbTIXNAvJXOi0aIEDASnsid9VxdayLENNHJKncwhIi2MkNiIK50AWSNJATjTvCr6EN2i6da0NbPLlqmnaTFkTXAiCDCnGVdrROMkmNOxzJnf08k7nY8CHa8vsqrGcNcJdTPdp08FTuruad2ncbdxyW2MMc1cS5OMjVGnERdA4jkq3hfEzMO0+hVy1kjNFv4lU5MLjtEJY62iO4/uue8lHkuZQObyVCoqs0uAfnpNduBB7i1/qgqYpzLQe4JH0TXs1iAM1OxktsdsxDSfopfFsNkeAHGZGYA3HabQtMFas7fj5eWNWS8FxIubBpvI5lkNPYukz5Jzh+fM5zGOE6Ebb3t0CCp70Ms/Npq3MYPMGI6GSOphI3ijqbTLybH4YgiOosedgOwVkuiS7HMThGPqGrlyPMZ8ujrakAfN9YWdp4L3eNsYY4G1iHF2aWx5easXYough0HN3H/AFbQY1t5lVfGarnYik8SCMzDOxcCA4c+fnySjfsUmvRLpMFLFBwBDQGmwuRmAIjmB9E5asx7ni7XHLltYAEDvaPAKnxWNqtJZXHxhvwuGjmEwSDsQbp/hbXVq2HpNJDXZ6josC46actfEKT6IJqy7wPEGOYCw3b8LuYcDB8TMf8ACs8BxRwkC8c4v4nRZzhfCz72uxgIDXuLzfrA03uVdcKoBxJbBAJsNbTqVBr6JxdrZZ5WPe2RLp5EgKh9usVNRjAJyNueroJ7LU4ekJBgDkR+XWZ9tMI9rw+AWOaL/wCoa/YpS3FlHlfroyr3nXN4Apt4tpdIRdFmB37rKctsbe+4ICMvEaaoyzYQuDUrQAhibfYCE407oHu6JrsQmVcjJG6RMWyTSYdDokzWgc0bAOeqbe5Q7GDkJmVzZ3XNLjqbJWMN/RABByhY/CNqC0Bw3Ul5I11QuaT06KUG4u0EW0zP/wCGLCtDwDHgSx9w4adtPqVAx9OWgjxH3TNOi4AOEwdO41C6UJKcTXB8kXThlN0BcCZhDw0F8jklqUXNNzBlYsuLi9FGSFO0P8PMPkW53jx8DC1bcX/iaRBA97TsbawNQRcTyWOzRbZaXgtMk59JABjcjTtZSxS1Rp8Sf+SNhMY9zS0kkNMQfmB31/hNVqBcZymJMOvE63tZWeNcz5RGYnbc8zzQvwbvhiTGpEj6FWOWzoVrRXMowAA102gDWfoWqfxTg+fDtewElhBcz9UTJIJ15+HO6tHcXw9BmaoQ5wAgbkkwqSr7TYisajGuoUiGhzGPa4veCYIaW2aRrv8AVTim9opnNR0zRcb4XTrUWVIhzRIO8FpBB81A9habQ8ggZgSB21+6svZbiIxWFcHNyvplzHtGxH4EnAcOGVzA1v6/sEpKmiUXyiw+M4mhhKj3VXnNWADWMBc8gW+ENvqdUHBfaDBOd7toex8H4ajHtmNbkR5qp9vqpGKfEsPuqeWoLZXAvPwu/SQSD4pj2HoPq4hj3kvLM7qj3XBLgQZO5JdPgrHFFKlK6Nc+vTLTleDF7OBPkqL2lxQfhxqCDF59Qo3tDwSmamfCDI8SXZT8PiPsqPF4h+RrX63neTPoqZai2SzP4OyqcD+rXokPZG4ieRXAc1kOWwPeaWS5g2eq4NJNkWUXBsjQhufJKHfwudTgxc8kRp87dEaAEtm5SLnuB+65MCQAJ0tslAEpxzbIWmO5VViYLhNxZLmEBKBOqb0k+iEAJeChzGNEvuwbjXdFCloBKbW76TdSeKuawFrWiDDhyuBcfnNQyLqViRNJpi9h9lr8d7aNGCW2it4bijTeY/N/2VzxpzXllRggOaJ6FUlbClrgrjDQGFp0t+60ZYco0i2ceUaIdMEmy0nC3u92RBtod+1lVUso/UPztK0vCMP8BnfvPoq4YeOxYouLsyPEcdkqFxuRy5qJieP1q4DWgsbuRqfHZXPtHwbK8VP07zJ9P+FBZxdjfgJOgEyD5DRTSS9Gnk370ajg3DcJVwzqRf8AE8Al7iC4OHykE6QbxpZVb/YzFCq0hjHkSGvDgGxzINx2EqhqYmmPkcS475mgf7RKu+E8SxL/AIC5wbzbmkjvy8EuTS2SqM2WNDDu4bXDQ/3jq4Ob/Lm5jkBotNhoJD2n82WVxHDatR4dmdLPlBmToRB30/dQ8J7WsoZqb2vztJtEQRsZKrk5SejRFRitmwocRLMU/wB6A+lUaGi0lrhseYUvjjnCi73ZDWGSBTaRPKYUD2IxJxbatV1PKwkNZMEuLZk6WhaKthWspuzXAB+aALd1OKl0yqcoJ3EwXDOIhjSS1r5sA1wJJ5mFH4u8GCW5XanXfmJlW7MK1s1XtIE/DrB6iDBCzXFMe17iS208zfsXT9FDI0o0ZM2W1RDrPaNA0nnr9ZUZ7y6JPiicxjr5nA+Dv2RRcFpbbw+seiyGNsCRMbLgRcLnZs3xCJTjdYASeiDYLacwZ0SPaSSZlPOcYNrbpuGxNwlbCxrPBywkUhrQW3N1ydodhE6XhCX7DVE4gnS6Qu81AjQLrXlEy+qbbczFkjYB6KVaCg2wJjdclIGy7KAUhCPAOynYdo906NfyPWFBI1kpxlXKCNjqr8F8kXYXUrGntnVIa5Gl0NR8fymrc7/nVdE2Ik4aqS62Ud2/wVueGuhgBMB3+nLPhr9FgcE8gzrcRafJarBY6QCYtzyujvBH7oGjTYvAtezKW26rG8U9mmEyCG+AP55rcU8VmYD0VfiwqpfwKMRR4SxhkMB/qa36NAPqVp+CHKcxDWtOnwi8a2ET3J80jqLRJcNNv369PPkRcXTYw6095hjB0BuRvHRUOTvYlcXo0QxbQDsBb9Lew+EdeawXtBh24kuysl4kB0RHczcdFpK1eBESNuwzlv8A8QxRKQE2bcqfKnom5Nkr2cxdSjTawsDWtEWNvotFSccQMrh8PZVmCwpdFlpeHYbKrY2+yLZUe0/DHtpD3U5RqGgnxjT0XndfKXEVGZHbuZYdMwFvLzXteKp5mOB3C8i9p8HkcSGZWzcARfmT+oHn66KvPGlaM817KWvhy24hzTuIUex12RUKzhoYG41B6EGyczB20Hlsf6SbjsZ7rG0vRQxGukWMTsuLo3JQPkRaISlt5UCJznHslY9Nh1zYlGwTt3Q0Amca+C5K5ttLLk6QqCg3CVot1RNubeqQvuo2MbnmEfy6Jxz51CaHbwRdisQXtF1zp0jRcNbWXOtzTGcxs6x4p5jdzYeKbJtHmm8VUhpHrot3jx0aMK9jeJdJtb86qPWcLNOpQh0gDNPQTI9ULq0Oyw0n83mxWk0E0US1kt16gfTfxU7hWKtBOZ20x6XuofvQWZSb+BPhCi8KrBjzrOg3i/1STJM9B4JitGON+3p173V6+iNfwduZWNw2KcYyCJ1JNz3tMdLfdarBV8wAcbqLQiHiKcGeWg6/l+6i0aF2zsc58LN8jJWgfhQfsuOAH5+dVW4bHZT06GY+DfVrreqs8Hw4alTKGCj0+kKwoUlKMPsTZ2EwoCsqTIQU2pwOVqRBjjivNPaxkPcG0iCCYfctPR3MX00Xornrzv2we0uOmsxnJM8w0Ot5BVZ38SufRjHsMG0cxyPTpyKacwDW6e3k8vTkhDQT02XNb9mYAVDoYXSClcwCbQVxaB5ItCYBkRl5ri92kXXN1mQiqPjS6YHNcRaFyOo1zRrquSAVzr/shY+DICWBt4oWiZ2OyQCueTr6IWPvJCMAARvqhaAUaASo+b6CbJM0CYR1KeQkHXzTe2nVSr0AmYkxulrkZYIiPT6ogJM6dT+6Ct8LYnqSLj86rfh1FG3CviVj6gYXEGTsYuq9kuMkhP12NJN/zwS0i0NkgdAASfX7K8Y7hnxYePPwSU35XaAd/vKfwlMGwbDiJJ/V63ChYw5Ty5lL2P0anDYpzh8FupMT4bN7K+4S9zPm+snueXaQsNwbHR8Lf9wgHsLWPX7q/pcSeSGMYf6nTHgNT6JMkmei4aqD5fkKwprJcHrlgGZ8k7kj0ELU4Z8hCFJUTmMThgJgPSsqXTIkxtZvNNvxIUKoZlQySHI5BRbVK3wk6WJXlftDWJqOzOGpjKY18V6jTZmYZ5Lyr2jpZartxtcOPnr4LP5DfEpy9FTVaQQjDoIEymwZF/JIBAWAzhOFzdJlmxRe73lFl6osTGcnIoRPdOua3VCQBYBNMaCMxPnK5AHE9lyAHbxfRc5ttENRoB3CQ1EqAVrTMwiJPIBC12g1SNbrIkpgE55EixlcyBBSmpt4plsEp9gT8vw5iQeyrMQ4B17eAHmVd0qoyw0fn3VBxSmA6TMbroY/1N2L9SDUILuY8I8FFDmz12iYB2v/ACrAvBAt4AXjm4n6BRK9IAggeGqssbLLhbdBljN4k87DRR+PYWDa1lN4VVy31Ok6d4/PqrF+HbWBiOp5nYKLdMLtUZLh9QMd12G8/YLQ4HFkzlDiTy+X9yO9raC6rMRwRzKkbLTcLFOkyHW6AfWdT4KV2EbFwmHxDpcZkxAMAxzPONhoFvOA58gz6iLfzuZWWwvGKebKCJJjXymBOuy2vDqoyiGujmRE9kbsk6olOZzB7pmlUiylV6nwkzAVXRqxJQyBIfiADdMYd2Z0i4VXjape7KNjH/K0XB8NAuktsdFlRo/AR0XlPtVw8srO+bnpAHIAzdeyNZZebf8AiBR+MEE+Bbl7xMztKh5CXCynItGEaw7pwmLhC8O5iAlbWtca6LmvZmODzAtY6pGk3sjyn0SNbefBGgBHZERdEGhogHvKEs6zuiwGSSOqVEB16rk7A6rBM3hCCBdPE80LGidLIvQWNb/dGylqUpCN+xI8ENisbA3Gm6ICbjVKLi3kuaiwsl4GmTrf7oOK4U5fiEco5+asKdJ4ZnBE9Ew6tIyk/F+aro4/1Rvx6ijN0aeoIcf40HJQ8fWsQLdo+yuOJUg2Te+w3/hZzGmTHny/lSW2OWhcHVIsSQDqNz/C0PCMWS9o0bNu3P0sqOhhQ0dfzVWGGcWuH5bl0SlJWRRvBgfeMkWMW5Dl3VBxTg72NgkAE/0kkz0lWHBuMfHHYD85Lf4Gix4BLRPMgJxaZKzCezXB3Z2hrQANXG4iNNPzneF6NQwZEfFoFJp4Zo0AHZTGU1bQmyqxtSGHQrLYnF5fGxB5LTe0tAim57Qbaxy5rzLG4skm5mfwjuqM0+JCU+JqOFjMQTc8/otZw99l57wDHlpE7i087La4biDMsz/KnjkmrJxfJaNQx1ljf/EDAh1POGiRuTt05rVYWtLQeYUH2haTRfAJMfpifVTmlKDRGS00eIn4hYW3KXMZAAskrvMmREkjl9EVPQ6TouTJUY2jnFcBO0JyI2mfRAXCbWUAOqu5i3NI22htyTjwCDuSm2iNNdELoVHBnM3SJ5zdcxsuQmOhkfkpHuIRPgRdcHg2idkwA7G6WDqbpsEzliOu0dUTnEG58lKgHGPIIOiVjhBBhC4mN46oQ4duqQGw4Mwvp5S3xP1CoOMYJ9N5y2nf+eS0nsxUGTKPqneMUA6QQt+N/A2Y38TFscHCCOnWBqq3E8OaTm2lXeJpZST5KFVBNlFy2OTIApDYLv8ADFTmU4ulqg5TGqq5pyoq5pyoj4WmWODhsvSvZvHy34tdtJ+pK8xZiobfVaT2Z4gWkC087ADnJV8G0y1I9XoVZU5qouF4oOAIv+aq7pOWlDErMkLyT2swrWVfhbAJJgWg9uS9bxFZrYBOtgsJ7c8MJPvG6bt+4VOeNxZXkjcTD4bEFrpPIx+eq1/sqxzyXvMiQGjYQsnhcA6o8NAn7dVuOA0fdfC7p+yp8a2v4GC6Zs8O6AofG8TlpPMTA0TtKsIVR7T4rLReR22+4K1TdRZOb0zy7GVs73O6902I2PgU6TmBtEnf6oG3mLd1yJMxBF0DvqmXOOxsbWTmWOyR2kpJgNz8W9uSeDogwga62uvRKLDmhgKHEzJC5Jr2XJAJUp6bocnZPe7MWQFvO38p2AJYNNLJX07iBtzkErnnxXFu8p2wBDCLHb8hK0E6I46o/dn85osDS+yFMBxt9bK04xTiSmvYzDWLifT6ndW/F6ALSuhiT4G3CvijzvGYgF0JkCO5T2NoQ9A+gXG2wPkqs3xiLO+MSNn/ADkjZBtB7BCWGNE9SomRse8LIYSlxVPK9TeFVgHgkSix+BeW5gNOuqh8MqS5bccrjZ0MUlJHpvBsWZB0Bi0b7LZYd9pleecNrhzMvTZargmKMZCIi0bxz6LTFkpKi7rtzX3Gio2va4uoVHZnkX6TOnp5rQUnToq7G8JhxqMAzmNek/upNWCa6ZiuG4J1HEuY7rlOxHNaFlMF1t0zxjCucG1APiaYcPTNZTMFhzEzP5KrhHiqIxjxVD7GkKg9sqkU2tuJOu1tjyWkvyWP9sq5Lms/TEqOd1BleV1FmRcTzCbzbX+ykOYNIHdNON9LD6rmpIyiP0+6EnMLHQI39PVAJ/IQkLQMWnXmidEixSuYdB5onNMDWefonQxprto0XIywiQRNtkqKFZKJMRsCgcEb3XEeSbynXsOvP6JJDOiNdPVBnEkWRQTaDBv4De3ikewgRBBt0sRb0IKnSDRzXjkjo1ASAN4UfKYsFwztJI1Ea9/3TUUNUes4SmyjSbo0AX7qp4jjmZS5r9dLrE4/jOIe0scbOIsLn02sVXNxFUHwAPbb7Lb+WNUbY5YJdlnWxmZ7hAMAXOt5t6JirVE66i3Yqoc2oHlwd1jwTdak9xJJN7CLKvI4yVWV5pxktFr/AIhvMWTjcY3mPss+3DOvc2mwv4pX0HWBzaAgERbmFV+KP2Z+KNAMY3cjwUPE0GZs7IB3Cqiy1sw53tPlZI1n+oqUY8XaZKHxdo0OE4gWxC0/BeJS5pc43PnuvP2AAD4zKs+GVIOd1TQ5QARPlyg6q9ZEafzRfZ7hgHhwEKwDbLOezWNDqQdPQK4fi4IvY+a0J6HViO4c2TuDqD1Va/APpSQZaLxurR+LDQXHQa9uaN9dpB0/cJaHspa2NY1pcSP2WA4tiW1HuftMDrH56ovaPMyu9jHAsJByzFiAYBuN7KkdIEzaeaw+RPl8TNlleh8sbN9Jt1QljdrTpKZzO3Pb1P1KUTsTp+fnZZqKaFNMEiPGxKU0t7W23QupuIkG8AkaDufRIWHWTAIHUySbbkWPonQqCewbHe//ACEXuyP4Qhx/za7weYsfUriSIk2nrr9tkgoNjLzbtuuXMJB5eEeVrLkDDfUJGnrAnS/WybY4i4OU8xAN+cpH79/uEZ1PggiCx5Fr5eunjsVzX9hB3tz8UdP5f+k/UJnF/IOx+r0IDmAjcR2BE3F9tD6pW5hMnLeP48L2Qn5R+blSX/L+c0wGI11nWRtz7pHQW/KZ+vnpqpFDQ91w1f2P9wQA2H/ENQRBtMZoiQJ+awvP8B7sf5Z20vPaZRYn5h+bJ923c/dADDmBziSByOa5Fr2vJRup2+UHw2H828EGH+Y9x9FLxeru7/qkNMhmmMwAbprbnJn85JBR5sbpyB9N1Op/q8f7QmB9v/0nYhhmEbqctzqRy2Mm65/D2aujQERbzv1U7Ff+1/Q3+4pij/6jP6h/cEcmgUmS8HiqlEQx8AQINxAUmrx2o54JeCWgARHOZVNX+Yf1D6KZU+Sl/Sf/ALHqSyyrsn+WS9lpW45XIyufYiSQAIg/wmavG6zr+80A0gTPgqfF6jxS1Plb+bNS/LL7E8svsce4F2aCSSdTzlKSwTETfa/iT4Jhu35sUB+Z3cfdRexNkh4aQCAdYNxAsIA56HbkkBk3vBJud+cppmh/q+xRt+U+P9yPYBPgmwIE2EzEcidReLpX5SALzzvrMEE8klXf85IP0hCAdpNbEEmNTcTEQTp280LaY22m07fZBV+Z/wDU7+5N4bVJgSfc21IOsG2xdM/TuuQVtB2/dcgD/9k=',
      ),
    ),
    store: store,
    cache: cache,
    // getCache: ctx.getCache,
    createNode: createNode,
    createNodeId: createNodeId,
    ext: '.jpg',
    name: 'test-image',
  })
  sourceData.risks.forEach(({ notes, ...rest }) => {
    createNodeFromData({ ...rest, notesMdx: notes }, RISK_NODE_TYPE, helpers)
  })
  // sourceData.authors.forEach((author) => createNodeFromData(author, AUTHOR_NODE_TYPE, helpers))

  return
}

/**
 * ============================================================================
 * Transform remote file nodes
 * ============================================================================
 */

exports.onCreateNode = async ({ actions: { createNode }, getCache, createNodeId, node }) => {
  // transform remote file nodes using Gatsby sharp plugins
  // because onCreateNode is called for all nodes, verify that you are only running this code on nodes created by your plugin
  if (node.internal.type === RISK_NODE_TYPE) {
    // create a FileNode in Gatsby that gatsby-transformer-sharp will create optimized images for
    // const fileNode = await createRemoteFileNode({
    //   // the url of the remote image to generate a node for
    //   url: node.imgUrl,
    //   getCache,
    //   createNode,
    //   createNodeId,
    //   parentNodeId: node.id,
    // })
    // if (fileNode) {
    //   // used to add a field `remoteImage` to the Risk node from the File node in the schemaCustomization API
    //   node.remoteImage = fileNode.id
    //   // inference can link these without schemaCustomization like this, but creates a less sturdy schema
    //   // node.remoteImage___NODE = fileNode.id
    // }
  }
}
