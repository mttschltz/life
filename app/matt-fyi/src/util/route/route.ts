interface Routes {
  category: {
    detail: (c: { __typename: 'Store_Category'; path: string }) => string
  }
  risk: {
    detail: (r: { __typename: 'Store_Risk'; id: string }) => string
  }
}

const useRoute = (): Routes => {
  return {
    category: {
      detail: (c): string => `/${c.path}`,
    },
    risk: {
      detail: (r): string => `/risk/${r.id}`,
    },
  }
}

export type { Routes }
export { useRoute }
