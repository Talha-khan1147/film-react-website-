# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useCreateProfile, useUpdateProfile, useDeleteProfile, useGetMyProfile, useCreateConversation, useCreateConversationMember, useListMyConversations, useSendMessage, useListMessages } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser();

const { data, isPending, isSuccess, isError, error } = useCreateProfile();

const { data, isPending, isSuccess, isError, error } = useUpdateProfile(updateProfileVars);

const { data, isPending, isSuccess, isError, error } = useDeleteProfile();

const { data, isPending, isSuccess, isError, error } = useGetMyProfile();

const { data, isPending, isSuccess, isError, error } = useCreateConversation();

const { data, isPending, isSuccess, isError, error } = useCreateConversationMember(createConversationMemberVars);

const { data, isPending, isSuccess, isError, error } = useListMyConversations();

const { data, isPending, isSuccess, isError, error } = useSendMessage(sendMessageVars);

const { data, isPending, isSuccess, isError, error } = useListMessages(listMessagesVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, createProfile, updateProfile, deleteProfile, getMyProfile, createConversation, createConversationMember, listMyConversations, sendMessage, listMessages } from '@dataconnect/generated';


// Operation CreateUser: 
const { data } = await CreateUser(dataConnect);

// Operation CreateProfile: 
const { data } = await CreateProfile(dataConnect);

// Operation UpdateProfile:  For variables, look at type UpdateProfileVars in ../index.d.ts
const { data } = await UpdateProfile(dataConnect, updateProfileVars);

// Operation DeleteProfile: 
const { data } = await DeleteProfile(dataConnect);

// Operation GetMyProfile: 
const { data } = await GetMyProfile(dataConnect);

// Operation CreateConversation: 
const { data } = await CreateConversation(dataConnect);

// Operation CreateConversationMember:  For variables, look at type CreateConversationMemberVars in ../index.d.ts
const { data } = await CreateConversationMember(dataConnect, createConversationMemberVars);

// Operation ListMyConversations: 
const { data } = await ListMyConversations(dataConnect);

// Operation SendMessage:  For variables, look at type SendMessageVars in ../index.d.ts
const { data } = await SendMessage(dataConnect, sendMessageVars);

// Operation ListMessages:  For variables, look at type ListMessagesVars in ../index.d.ts
const { data } = await ListMessages(dataConnect, listMessagesVars);


```