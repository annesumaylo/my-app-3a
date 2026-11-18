
const API_URL = 'https://6af96d2c6d8b86fb22d6fc0f.mockapi.io/api';

// USER TYPE
export type User = {
  id: string;
  name: string;
  avatar: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  createdAt: string;
};

// POST TYPE
export type Post = {
  id: string;
  userId: string;
  name?: string;
  username: string;
  avatar: string;
  caption: string;
  image: string;
  musicTitle: string;
  artist: string;
  likes: number;
  createdAt: string;
  reactions?: Record<string, number>;
  reactionUsers?: Record<string, string>;
  favorites?: string[];
};

// TEMPORARY LOGGED-IN USER
let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

// REGISTER USER
export const registerUser = async (
  name: string,
  username: string,
  email: string,
  password: string
): Promise<User> => {

  // CHECK IF EMAIL ALREADY EXISTS
  const checkResponse = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}`
  );

  if (!checkResponse.ok) {
    throw new Error('Unable to check email. Please try again.');
  }

  const existingUsers: User[] = await checkResponse.json();

  if (existingUsers.length > 0) {
    throw new Error('This email is already registered.');
  }

  // CREATE NEW USER
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      username,
      email,
      password,
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: '',
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Registration failed. Please try again.');
  }

  const newUser: User = await response.json();

  return newUser;
};

// LOGIN USER
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {

  // SEARCH USER BY EMAIL
  const response = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error('Unable to connect to the server.');
  }

  const users: User[] = await response.json();

  // CHECK IF ACCOUNT EXISTS
  if (users.length === 0) {
    throw new Error('Account not found. Please register first.');
  }

  // CHECK PASSWORD
  const user = users.find(
    item => item.password === password
  );

  if (!user) {
    throw new Error('Incorrect password. Please try again.');
  }

  // SAVE LOGGED-IN USER
  setCurrentUser(user);

  return user;
};

// LOGOUT USER
export const logoutUser = () => {
  setCurrentUser(null);
};

// GET ALL POSTS
export const getPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_URL}/posts`);

  if (!response.ok) {
    throw new Error('Unable to load posts.');
  }

  const posts: Post[] = await response.json();

  return posts.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
};

// CREATE POST
export const createPost = async (
  post: Omit<Post, 'id' | 'createdAt'>
): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...post,
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Unable to create post.');
  }

  return response.json();
};

// UPDATE USER PROFILE
export const updateProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'name' | 'username' | 'avatar' | 'bio'>>
): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Unable to update profile.');
  }

  const updatedUser: User = await response.json();

  // UPDATE CURRENT USER IF IT IS THE SAME ACCOUNT
  if (currentUser?.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
};

// UPDATE POST (REACTIONS AND FAVORITES)
export const updatePost = async (
  postId: string,
  updates: Partial<
    Pick<Post, 'likes' | 'reactions' | 'reactionUsers' | 'favorites'>
  >
): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Unable to update post.');
  }

  return response.json();
};
