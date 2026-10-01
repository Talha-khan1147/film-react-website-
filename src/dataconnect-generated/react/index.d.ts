import { CreateUserData, CreateProfileData, UpdateProfileData, UpdateProfileVariables, DeleteProfileData, GetMyProfileData, CreateConversationData, CreateConversationMemberData, CreateConversationMemberVariables, ListMyConversationsData, SendMessageData, SendMessageVariables, ListMessagesData, ListMessagesVariables, DeleteMessageData, DeleteMessageVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useCreateProfile(options?: useDataConnectMutationOptions<CreateProfileData, FirebaseError, void>): UseDataConnectMutationResult<CreateProfileData, undefined>;
export function useCreateProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProfileData, FirebaseError, void>): UseDataConnectMutationResult<CreateProfileData, undefined>;

export function useUpdateProfile(options?: useDataConnectMutationOptions<UpdateProfileData, FirebaseError, UpdateProfileVariables>): UseDataConnectMutationResult<UpdateProfileData, UpdateProfileVariables>;
export function useUpdateProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProfileData, FirebaseError, UpdateProfileVariables>): UseDataConnectMutationResult<UpdateProfileData, UpdateProfileVariables>;

export function useDeleteProfile(options?: useDataConnectMutationOptions<DeleteProfileData, FirebaseError, void>): UseDataConnectMutationResult<DeleteProfileData, undefined>;
export function useDeleteProfile(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProfileData, FirebaseError, void>): UseDataConnectMutationResult<DeleteProfileData, undefined>;

export function useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
export function useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;

export function useCreateConversation(options?: useDataConnectMutationOptions<CreateConversationData, FirebaseError, void>): UseDataConnectMutationResult<CreateConversationData, undefined>;
export function useCreateConversation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConversationData, FirebaseError, void>): UseDataConnectMutationResult<CreateConversationData, undefined>;

export function useCreateConversationMember(options?: useDataConnectMutationOptions<CreateConversationMemberData, FirebaseError, CreateConversationMemberVariables>): UseDataConnectMutationResult<CreateConversationMemberData, CreateConversationMemberVariables>;
export function useCreateConversationMember(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConversationMemberData, FirebaseError, CreateConversationMemberVariables>): UseDataConnectMutationResult<CreateConversationMemberData, CreateConversationMemberVariables>;

export function useListMyConversations(options?: useDataConnectQueryOptions<ListMyConversationsData>): UseDataConnectQueryResult<ListMyConversationsData, undefined>;
export function useListMyConversations(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyConversationsData>): UseDataConnectQueryResult<ListMyConversationsData, undefined>;

export function useSendMessage(options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;
export function useSendMessage(dc: DataConnect, options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;

export function useListMessages(vars: ListMessagesVariables, options?: useDataConnectQueryOptions<ListMessagesData>): UseDataConnectQueryResult<ListMessagesData, ListMessagesVariables>;
export function useListMessages(dc: DataConnect, vars: ListMessagesVariables, options?: useDataConnectQueryOptions<ListMessagesData>): UseDataConnectQueryResult<ListMessagesData, ListMessagesVariables>;

export function useDeleteMessage(options?: useDataConnectMutationOptions<DeleteMessageData, FirebaseError, DeleteMessageVariables>): UseDataConnectMutationResult<DeleteMessageData, DeleteMessageVariables>;
export function useDeleteMessage(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMessageData, FirebaseError, DeleteMessageVariables>): UseDataConnectMutationResult<DeleteMessageData, DeleteMessageVariables>;
