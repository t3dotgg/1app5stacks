/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  vote?: Maybe<VoteResult>;
};


export type MutationVoteArgs = {
  downvoteId: Scalars['Int']['input'];
  upvoteId: Scalars['Int']['input'];
};

export type Pokemon = {
  __typename?: 'Pokemon';
  dexId?: Maybe<Scalars['Int']['output']>;
  downVotes?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  upVotes?: Maybe<Scalars['Int']['output']>;
};

export type RandomPair = {
  __typename?: 'RandomPair';
  pokemonOne?: Maybe<Pokemon>;
  pokemonTwo?: Maybe<Pokemon>;
};

export type Result = {
  __typename?: 'Result';
  dexId?: Maybe<Scalars['Int']['output']>;
  downVotes?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lossPercentage?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  totalVotes?: Maybe<Scalars['Int']['output']>;
  upVotes?: Maybe<Scalars['Int']['output']>;
  winPercentage?: Maybe<Scalars['Float']['output']>;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  pokemon?: Maybe<Array<Maybe<Pokemon>>>;
  randomPair?: Maybe<RandomPair>;
  results?: Maybe<Array<Maybe<Result>>>;
};

export type VoteResult = {
  __typename?: 'VoteResult';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RandomPairQueryVariables = Exact<{ [key: string]: never; }>;


export type RandomPairQuery = { __typename?: 'RootQuery', randomPair?: { __typename?: 'RandomPair', pokemonOne?: { __typename?: 'Pokemon', id?: number | null, name?: string | null } | null, pokemonTwo?: { __typename?: 'Pokemon', id?: number | null, name?: string | null } | null } | null };

export type PokemonQueryVariables = Exact<{ [key: string]: never; }>;


export type PokemonQuery = { __typename?: 'RootQuery', pokemon?: Array<{ __typename?: 'Pokemon', name?: string | null, id?: number | null, upVotes?: number | null, downVotes?: number | null } | null> | null };


export const RandomPairDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RandomPair"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"randomPair"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemonOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pokemonTwo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RandomPairQuery, RandomPairQueryVariables>;
export const PokemonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Pokemon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upVotes"}},{"kind":"Field","name":{"kind":"Name","value":"downVotes"}}]}}]}}]} as unknown as DocumentNode<PokemonQuery, PokemonQueryVariables>;