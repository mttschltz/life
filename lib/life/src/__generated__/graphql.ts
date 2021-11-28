import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

/** A Category is an ordered collection of Risks or other Categories. */
export type Category = {
  __typename?: 'Category';
  /** The id. */
  id: Scalars['ID'];
  /** The path used in the first URL segment. */
  path: Scalars['String'];
  /** The name. */
  name: Scalars['String'];
  /** The description. */
  description?: Maybe<Scalars['String']>;
  /** An ordered list of Risks or Categories. */
  children: Array<Maybe<Concern>>;
  /** The parent. */
  parent?: Maybe<Category>;
};

export enum CategoryTopLevel {
  Health = 'HEALTH',
  Wealth = 'WEALTH',
  Security = 'SECURITY'
}

/** A Concern needs addressing. It can be a single Risk or group (Category) of Risks. */
export type Concern = Category | Risk;

/** Create risk input. */
export type CreateRiskInput = {
  /** URI part. */
  uriPart: Scalars['String'];
  /** Risk category. */
  category: CategoryTopLevel;
  /** Risk name. */
  name: Scalars['String'];
  /** Risk parent ID. */
  parentId?: Maybe<Scalars['ID']>;
  /** Risk notes. */
  notes?: Maybe<Scalars['String']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  /** Create a risk. */
  createRisk: Risk;
};


export type MutationCreateRiskArgs = {
  input: CreateRiskInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get all risks. */
  risks: Array<Maybe<Risk>>;
  /** Get all categories. */
  categories: Array<Maybe<Category>>;
};


export type QueryRisksArgs = {
  category?: Maybe<CategoryTopLevel>;
};


export type QueryCategoriesArgs = {
  parentID?: Maybe<Scalars['ID']>;
};

/** A Risk is something that may cause harm to yourself, your family, or your goals. */
export type Risk = {
  __typename?: 'Risk';
  /** The id. */
  id: Scalars['ID'];
  /** The name. */
  name: Scalars['String'];
  /** Risk category. */
  category: CategoryTopLevel;
  /** Parent risk. */
  parent?: Maybe<Risk>;
  /** Child risks. */
  children?: Maybe<Array<Maybe<Risk>>>;
  /** Risk notes. */
  notes?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Category: ResolverTypeWrapper<Omit<Category, 'children'> & { children: Array<Maybe<ResolversTypes['Concern']>> }>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CategoryTopLevel: CategoryTopLevel;
  Concern: ResolversTypes['Category'] | ResolversTypes['Risk'];
  CreateRiskInput: CreateRiskInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Risk: ResolverTypeWrapper<Risk>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Category: Omit<Category, 'children'> & { children: Array<Maybe<ResolversParentTypes['Concern']>> };
  ID: Scalars['ID'];
  String: Scalars['String'];
  Concern: ResolversParentTypes['Category'] | ResolversParentTypes['Risk'];
  CreateRiskInput: CreateRiskInput;
  DateTime: Scalars['DateTime'];
  Mutation: {};
  Query: {};
  Risk: Risk;
  Boolean: Scalars['Boolean'];
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  children?: Resolver<Array<Maybe<ResolversTypes['Concern']>>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConcernResolvers<ContextType = any, ParentType extends ResolversParentTypes['Concern'] = ResolversParentTypes['Concern']> = {
  __resolveType: TypeResolveFn<'Category' | 'Risk', ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createRisk?: Resolver<ResolversTypes['Risk'], ParentType, ContextType, RequireFields<MutationCreateRiskArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  risks?: Resolver<Array<Maybe<ResolversTypes['Risk']>>, ParentType, ContextType, RequireFields<QueryRisksArgs, never>>;
  categories?: Resolver<Array<Maybe<ResolversTypes['Category']>>, ParentType, ContextType, RequireFields<QueryCategoriesArgs, never>>;
};

export type RiskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Risk'] = ResolversParentTypes['Risk']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['CategoryTopLevel'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Risk']>, ParentType, ContextType>;
  children?: Resolver<Maybe<Array<Maybe<ResolversTypes['Risk']>>>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Category?: CategoryResolvers<ContextType>;
  Concern?: ConcernResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Risk?: RiskResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
