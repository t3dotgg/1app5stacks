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
  dexId: Scalars['Int']['output'];
  downVotes: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  upVotes: Scalars['Int']['output'];
};

export type RandomPair = {
  __typename?: 'RandomPair';
  pokemonOne: Pokemon;
  pokemonTwo: Pokemon;
};

export type Result = {
  __typename?: 'Result';
  dexId: Scalars['Int']['output'];
  downVotes: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lossPercentage: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  totalVotes: Scalars['Int']['output'];
  upVotes: Scalars['Int']['output'];
  winPercentage: Scalars['Float']['output'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  pokemon?: Maybe<Array<Maybe<Pokemon>>>;
  randomPair?: Maybe<RandomPair>;
  results: Array<Result>;
};

export type VoteResult = {
  __typename?: 'VoteResult';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type RandomPairQueryVariables = Exact<{ [key: string]: never; }>;


export type RandomPairQuery = { __typename?: 'RootQuery', randomPair?: { __typename?: 'RandomPair', pokemonOne: { __typename?: 'Pokemon', id: number, name: string }, pokemonTwo: { __typename?: 'Pokemon', id: number, name: string } } | null };

export type VoteMutationVariables = Exact<{
  upvoteId: Scalars['Int']['input'];
  downvoteId: Scalars['Int']['input'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote?: { __typename?: 'VoteResult', success?: boolean | null } | null };

export type ResultsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ResultsQueryQuery = { __typename?: 'RootQuery', results: Array<{ __typename?: 'Result', dexId: number, downVotes: number, upVotes: number, name: string, winPercentage: number }> };


export const RandomPairDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RandomPair"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"randomPair"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemonOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pokemonTwo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RandomPairQuery, RandomPairQueryVariables>;
export const VoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Vote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upvoteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"downvoteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upvoteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upvoteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"downvoteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"downvoteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<VoteMutation, VoteMutationVariables>;
export const ResultsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResultsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dexId"}},{"kind":"Field","name":{"kind":"Name","value":"downVotes"}},{"kind":"Field","name":{"kind":"Name","value":"upVotes"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"winPercentage"}}]}}]}}]} as unknown as DocumentNode<ResultsQueryQuery, ResultsQueryQueryVariables>;