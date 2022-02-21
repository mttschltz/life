import { DateScalar } from 'lib/life/src/type/scalars';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: DateScalar;
};

/** A Category is an ordered collection of Risks or other Categories. */
export type Category = Updated & {
  __typename?: 'Category';
  /** The id. */
  id: Scalars['ID'];
  /** The slug used in the URL path. */
  slug: Scalars['String'];
  /** The slugs previously used in the URL path. */
  previousSlugs: Array<Scalars['String']>;
  /** The name. */
  name: Scalars['String'];
  /** The description. */
  description?: Maybe<Scalars['String']>;
  /**
   * An ordered list of Risks or Categories.
   * TODO: Make this of type [Concern]!
   */
  children: Array<Maybe<Category>>;
  /** The parent. */
  parent?: Maybe<Category>;
  /** Time of last significant update to the category. */
  updated: Scalars['Date'];
  /** Short description of the category. */
  shortDescription: Scalars['String'];
};

export enum CategoryTopLevel {
  Health = 'HEALTH',
  Wealth = 'WEALTH',
  Security = 'SECURITY'
}

/** A Concern needs addressing. It can be a single Risk or group (Category) of Risks. */
export type Concern = Category | Risk;

/** Create category input. */
export type CreateCategoryInput = {
  /** Category slug used in the URL path. */
  slug: Scalars['String'];
  /** The slugs previously used in the URL path. */
  previousSlugs?: Maybe<Array<Scalars['String']>>;
  /** Description. */
  description?: Maybe<Scalars['String']>;
  /** Category name. */
  name: Scalars['String'];
  /** Category parent ID. */
  parentId?: Maybe<Scalars['ID']>;
  /** Short description of the category. */
  shortDescription?: Maybe<Scalars['String']>;
  /** Time of last significant update to the category. */
  updated: Scalars['Date'];
};

/** Create risk input. */
export type CreateRiskInput = {
  /** Risk category. */
  category: CategoryTopLevel;
  /** Risk name. */
  name: Scalars['String'];
  /** Risk notes. */
  notes?: Maybe<Scalars['String']>;
  /** Risk parent ID. */
  parentId?: Maybe<Scalars['ID']>;
  /** Time of last significant update to the risk. */
  updated: Scalars['Date'];
  /** URI part. */
  uriPart: Scalars['String'];
};


export enum Impact {
  High = 'HIGH',
  Normal = 'NORMAL'
}

export enum Likelihood {
  High = 'HIGH',
  Normal = 'NORMAL'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a risk. */
  createRisk: Risk;
  /** Create a category. */
  createCategory: Category;
};


export type MutationCreateRiskArgs = {
  input: CreateRiskInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get all risks. */
  risks: Array<Maybe<Risk>>;
  /** Get all categories. */
  categories: Array<Maybe<Category>>;
  /** Get all updated entities that may be of interest to users. */
  updated: Array<Maybe<Updated>>;
};


export type QueryRisksArgs = {
  category?: Maybe<CategoryTopLevel>;
};

/** A Risk is something that may cause harm to yourself, your family, or your goals. */
export type Risk = Updated & {
  __typename?: 'Risk';
  /** The id. */
  id: Scalars['ID'];
  /** Risk category. */
  category: CategoryTopLevel;
  /** The impact. */
  impact: Impact;
  /** The likelihood. */
  likelihood: Likelihood;
  /** The name. */
  name: Scalars['String'];
  /** Risk notes. */
  notes?: Maybe<Scalars['String']>;
  /** Parent risk. */
  parent?: Maybe<Risk>;
  /** The type of risk. */
  type: RiskType;
  /** Short description of the risk. */
  shortDescription: Scalars['String'];
  /** Time of last significant update to the risk. */
  updated: Scalars['Date'];
};

export enum RiskType {
  Risk = 'RISK',
  Goal = 'GOAL',
  Condition = 'CONDITION'
}

/**
 * An Updated entity logs its most recent, user-relevant changes so they can be viewed in order of
 * when they were last updated.
 */
export type Updated = {
  /** The id. */
  id: Scalars['ID'];
  /** The name of the entity. */
  name: Scalars['String'];
  /** Time of last significant update to the entity. */
  updated: Scalars['Date'];
  /** Short description of the updated entity - not a description of what was updated. */
  shortDescription: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
  Category: ResolverTypeWrapper<Category>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CategoryTopLevel: CategoryTopLevel;
  Concern: ResolversTypes['Category'] | ResolversTypes['Risk'];
  CreateCategoryInput: CreateCategoryInput;
  CreateRiskInput: CreateRiskInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Impact: Impact;
  Likelihood: Likelihood;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Risk: ResolverTypeWrapper<Risk>;
  RiskType: RiskType;
  Updated: ResolversTypes['Category'] | ResolversTypes['Risk'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Category: Category;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Concern: ResolversParentTypes['Category'] | ResolversParentTypes['Risk'];
  CreateCategoryInput: CreateCategoryInput;
  CreateRiskInput: CreateRiskInput;
  Date: Scalars['Date'];
  Mutation: {};
  Query: {};
  Risk: Risk;
  Updated: ResolversParentTypes['Category'] | ResolversParentTypes['Risk'];
  Boolean: Scalars['Boolean'];
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previousSlugs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  children?: Resolver<Array<Maybe<ResolversTypes['Category']>>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConcernResolvers<ContextType = any, ParentType extends ResolversParentTypes['Concern'] = ResolversParentTypes['Concern']> = {
  __resolveType: TypeResolveFn<'Category' | 'Risk', ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createRisk?: Resolver<ResolversTypes['Risk'], ParentType, ContextType, RequireFields<MutationCreateRiskArgs, 'input'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  risks?: Resolver<Array<Maybe<ResolversTypes['Risk']>>, ParentType, ContextType, RequireFields<QueryRisksArgs, never>>;
  categories?: Resolver<Array<Maybe<ResolversTypes['Category']>>, ParentType, ContextType>;
  updated?: Resolver<Array<Maybe<ResolversTypes['Updated']>>, ParentType, ContextType>;
};

export type RiskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Risk'] = ResolversParentTypes['Risk']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['CategoryTopLevel'], ParentType, ContextType>;
  impact?: Resolver<ResolversTypes['Impact'], ParentType, ContextType>;
  likelihood?: Resolver<ResolversTypes['Likelihood'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Risk']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RiskType'], ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdatedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Updated'] = ResolversParentTypes['Updated']> = {
  __resolveType: TypeResolveFn<'Category' | 'Risk', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Category?: CategoryResolvers<ContextType>;
  Concern?: ConcernResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Risk?: RiskResolvers<ContextType>;
  Updated?: UpdatedResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
