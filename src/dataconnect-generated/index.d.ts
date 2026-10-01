import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ConversationMember_Key {
  conversationId: UUIDString;
  userId: UUIDString;
  __typename?: 'ConversationMember_Key';
}

export interface Conversation_Key {
  id: UUIDString;
  __typename?: 'Conversation_Key';
}

export interface CreateConversationData {
  conversation_insert: Conversation_Key;
}

export interface CreateConversationMemberData {
  conversationMember_insert: ConversationMember_Key;
}

export interface CreateConversationMemberVariables {
  convId: UUIDString;
}

export interface CreateProfileData {
  profile_insert: Profile_Key;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteMessageData {
  message_delete?: Message_Key | null;
}

export interface DeleteMessageVariables {
  id: UUIDString;
}

export interface DeleteProfileData {
  profile_delete?: Profile_Key | null;
}

export interface GetMyProfileData {
  profile?: {
    displayName: string;
    statusMessage?: string | null;
  };
}

export interface ListMessagesData {
  messages: ({
    text: string;
    sender: {
      displayName: string;
    };
  })[];
}

export interface ListMessagesVariables {
  convId: UUIDString;
}

export interface ListMyConversationsData {
  conversations: ({
    id: UUIDString;
    lastMessageSnippet?: string | null;
  } & Conversation_Key)[];
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface Profile_Key {
  id: UUIDString;
  __typename?: 'Profile_Key';
}

export interface SendMessageData {
  message_insert: Message_Key;
}

export interface SendMessageVariables {
  convId: UUIDString;
  text: string;
}

export interface UpdateProfileData {
  profile_update?: Profile_Key | null;
}

export interface UpdateProfileVariables {
  displayName: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateProfileData, undefined>;
  operationName: string;
}
export const createProfileRef: CreateProfileRef;

export function createProfile(): MutationPromise<CreateProfileData, undefined>;
export function createProfile(dc: DataConnect): MutationPromise<CreateProfileData, undefined>;

interface UpdateProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileVariables): MutationRef<UpdateProfileData, UpdateProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProfileVariables): MutationRef<UpdateProfileData, UpdateProfileVariables>;
  operationName: string;
}
export const updateProfileRef: UpdateProfileRef;

export function updateProfile(vars: UpdateProfileVariables): MutationPromise<UpdateProfileData, UpdateProfileVariables>;
export function updateProfile(dc: DataConnect, vars: UpdateProfileVariables): MutationPromise<UpdateProfileData, UpdateProfileVariables>;

interface DeleteProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteProfileData, undefined>;
  operationName: string;
}
export const deleteProfileRef: DeleteProfileRef;

export function deleteProfile(): MutationPromise<DeleteProfileData, undefined>;
export function deleteProfile(dc: DataConnect): MutationPromise<DeleteProfileData, undefined>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface CreateConversationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateConversationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateConversationData, undefined>;
  operationName: string;
}
export const createConversationRef: CreateConversationRef;

export function createConversation(): MutationPromise<CreateConversationData, undefined>;
export function createConversation(dc: DataConnect): MutationPromise<CreateConversationData, undefined>;

interface CreateConversationMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConversationMemberVariables): MutationRef<CreateConversationMemberData, CreateConversationMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateConversationMemberVariables): MutationRef<CreateConversationMemberData, CreateConversationMemberVariables>;
  operationName: string;
}
export const createConversationMemberRef: CreateConversationMemberRef;

export function createConversationMember(vars: CreateConversationMemberVariables): MutationPromise<CreateConversationMemberData, CreateConversationMemberVariables>;
export function createConversationMember(dc: DataConnect, vars: CreateConversationMemberVariables): MutationPromise<CreateConversationMemberData, CreateConversationMemberVariables>;

interface ListMyConversationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyConversationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyConversationsData, undefined>;
  operationName: string;
}
export const listMyConversationsRef: ListMyConversationsRef;

export function listMyConversations(options?: ExecuteQueryOptions): QueryPromise<ListMyConversationsData, undefined>;
export function listMyConversations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyConversationsData, undefined>;

interface SendMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  operationName: string;
}
export const sendMessageRef: SendMessageRef;

export function sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;
export function sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface ListMessagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMessagesVariables): QueryRef<ListMessagesData, ListMessagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMessagesVariables): QueryRef<ListMessagesData, ListMessagesVariables>;
  operationName: string;
}
export const listMessagesRef: ListMessagesRef;

export function listMessages(vars: ListMessagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, ListMessagesVariables>;
export function listMessages(dc: DataConnect, vars: ListMessagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, ListMessagesVariables>;

interface DeleteMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMessageVariables): MutationRef<DeleteMessageData, DeleteMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMessageVariables): MutationRef<DeleteMessageData, DeleteMessageVariables>;
  operationName: string;
}
export const deleteMessageRef: DeleteMessageRef;

export function deleteMessage(vars: DeleteMessageVariables): MutationPromise<DeleteMessageData, DeleteMessageVariables>;
export function deleteMessage(dc: DataConnect, vars: DeleteMessageVariables): MutationPromise<DeleteMessageData, DeleteMessageVariables>;

