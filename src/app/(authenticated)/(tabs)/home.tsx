import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ReactionType = '❤️' | '😂' | '😮' | '😢' | '🔥';

type Comment = {
  id: string;
  name: string;
  text: string;
};

type Post = {
  id: string;
  name: string;
  username: string;
  time: string;
  message: string;
  song: string;
  artist: string;
  color: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  reactions?: Record<string, number>;
  userReaction?: ReactionType | null;
};

// CONFIRM DIALOG THAT WORKS ON PHONE AND WEB
// (Alert.alert with buttons does nothing on web, so use window.confirm there)
const confirmAction = (
  title: string,
  message: string,
  onConfirm: () => void
) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
};

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [newPost, setNewPost] = useState('');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      name: 'Maria Santos',
      username: '@maria',
      time: '10 minutes ago',
      message: "I can't stop listening to this song! It's my favorite lately. ❤️",
      song: 'Die With A Smile',
      artist: 'Lady Gaga, Bruno Mars',
      color: '#B95E85',
      likes: 24,
      liked: false,
      comments: [
        {
          id: 'c1',
          name: 'You',
          text: 'Such a beautiful song!',
        },
      ],
      reactions: {},
      userReaction: null,
    },
    {
      id: '2',
      name: 'John Reyes',
      username: '@john',
      time: '30 minutes ago',
      message: 'This song always makes my day better. What are you listening to?',
      song: 'Birds of a Feather',
      artist: 'Billie Eilish',
      color: '#648C9C',
      likes: 15,
      liked: false,
      comments: [],
      reactions: {},
      userReaction: null,
    },
    {
      id: '3',
      name: 'Angela Cruz',
      username: '@angela',
      time: '1 hour ago',
      message: 'A little music and a peaceful evening. 🎧',
      song: 'Perfect',
      artist: 'Ed Sheeran',
      color: '#B67A42',
      likes: 32,
      liked: false,
      comments: [
        {
          id: 'c2',
          name: 'You',
          text: 'My favorite too!',
        },
      ],
      reactions: {},
      userReaction: null,
    },
  ]);

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<string[]>([]);
  const [activeReactionPostId, setActiveReactionPostId] = useState<string | null>(null);

  // EDIT COMMENT STATES
  const [editingComment, setEditingComment] = useState<{
    postId: string;
    commentId: string;
  } | null>(null);

  const [editCommentText, setEditCommentText] = useState('');

  // EDIT POST STATES
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostText, setEditPostText] = useState('');

  // DELETE POST STATE (post waiting for delete confirmation)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // AVAILABLE EMOJI REACTIONS
  const reactionOptions: ReactionType[] = [
    '❤️',
    '😂',
    '😮',
    '😢',
    '🔥',
  ];

  // SEARCH POSTS
  const filteredPosts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return posts;

    return posts.filter(post =>
      [post.name, post.username, post.message, post.song, post.artist]
        .some(value => value.toLowerCase().includes(query))
    );
  }, [posts, search]);

  // CREATE POST
  const createPost = () => {
    if (!newPost.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting.');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      name: 'You',
      username: '@you',
      time: 'Just now',
      message: newPost.trim(),
      song: 'My Music Moment',
      artist: 'Shared by you',
      color: '#D94F82',
      likes: 0,
      liked: false,
      comments: [],
      reactions: {},
      userReaction: null,
    };

    setPosts(current => [post, ...current]);
    setNewPost('');

    Alert.alert('Success', 'Your post has been shared!');
  };

  // LIKE POST
  const toggleLike = (id: string) => {
    setPosts(current =>
      current.map(post =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  };

  // EMOJI REACTIONS
  const toggleReaction = (postId: string, reaction: ReactionType) => {
    setPosts(current =>
      current.map(post => {
        if (post.id !== postId) return post;

        const reactions = { ...post.reactions };

        // REMOVE PREVIOUS REACTION
        if (post.userReaction) {
          reactions[post.userReaction] = Math.max(
            0,
            (reactions[post.userReaction] || 0) - 1
          );
        }

        // REMOVE REACTION IF SAME EMOJI IS CLICKED
        if (post.userReaction === reaction) {
          return {
            ...post,
            reactions,
            userReaction: null,
          };
        }

        // ADD NEW REACTION
        reactions[reaction] = (reactions[reaction] || 0) + 1;

        return {
          ...post,
          reactions,
          userReaction: reaction,
        };
      })
    );
  };

  // SHOW OR HIDE COMMENTS
  const toggleComments = (id: string) => {
    setOpenComments(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  };

  // ADD COMMENT
  const addComment = (id: string) => {
    const comment = commentInputs[id]?.trim();

    if (!comment) {
      Alert.alert('Empty Comment', 'Please write a comment first.');
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      name: 'You',
      text: comment,
    };

    setPosts(current =>
      current.map(post =>
        post.id === id
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post
      )
    );

    setCommentInputs(current => ({
      ...current,
      [id]: '',
    }));
  };

  // START EDITING COMMENT
  const startEditComment = (
    postId: string,
    comment: Comment
  ) => {
    setEditingComment({
      postId,
      commentId: comment.id,
    });

    setEditCommentText(comment.text);
  };

  // SAVE EDITED COMMENT
  const saveEditComment = () => {
    if (!editingComment || !editCommentText.trim()) {
      Alert.alert('Empty Comment', 'Comment cannot be empty.');
      return;
    }

    setPosts(current =>
      current.map(post =>
        post.id === editingComment.postId
          ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === editingComment.commentId
                  ? {
                      ...comment,
                      text: editCommentText.trim(),
                    }
                  : comment
              ),
            }
          : post
      )
    );

    setEditingComment(null);
    setEditCommentText('');

    Alert.alert('Success', 'Comment updated successfully!');
  };

  // CANCEL EDITING
  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  // DELETE COMMENT
  const deleteComment = (postId: string, commentId: string) => {
    confirmAction(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      () => {
        setPosts(current =>
          current.map(post =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    comment => comment.id !== commentId
                  ),
                }
              : post
          )
        );

        if (
          editingComment?.postId === postId &&
          editingComment?.commentId === commentId
        ) {
          cancelEditComment();
        }
      }
    );
  };

  // START EDITING POST
  const startEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditPostText(post.message);
  };

  // SAVE EDITED POST
  const saveEditPost = () => {
    if (!editingPostId) return;

    if (!editPostText.trim()) {
      Alert.alert('Empty Post', 'Post cannot be empty.');
      return;
    }

    setPosts(current =>
      current.map(post =>
        post.id === editingPostId
          ? { ...post, message: editPostText.trim() }
          : post
      )
    );

    setEditingPostId(null);
    setEditPostText('');

    Alert.alert('Success', 'Post updated successfully!');
  };

  // CANCEL EDITING POST
  const cancelEditPost = () => {
    setEditingPostId(null);
    setEditPostText('');
  };

  // TAP TRASH ICON: ASK FOR CONFIRMATION INSIDE THE POST (works on web and phone)
  const requestDeletePost = (postId: string) => {
    setDeletingPostId(postId);
  };

  // CANCEL DELETE
  const cancelDeletePost = () => {
    setDeletingPostId(null);
  };

  // DELETE POST
  const deletePost = (postId: string) => {
    setPosts(current => current.filter(post => post.id !== postId));

    if (editingPostId === postId) {
      cancelEditPost();
    }

    if (editingComment?.postId === postId) {
      cancelEditComment();
    }

    setOpenComments(current => current.filter(id => id !== postId));
    setDeletingPostId(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>♫ MeloShare</Text>
            <Text style={styles.tagline}>Your Music Community</Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              Alert.alert('Notifications', 'No new notifications.')
            }
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={21} color="#999" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists, people..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* INTRODUCTION */}
        <Text style={styles.welcome}>
          Welcome to your music community! 🎵
        </Text>

        <Text style={styles.description}>
          Discover music and share your favorite moments with others.
        </Text>

        {/* CREATE POST */}
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Create a Post</Text>

          <View style={styles.createRow}>
            <View style={styles.myAvatar}>
              <Ionicons name="person" size={23} color="#FFFFFF" />
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="What's your music mood today?"
              placeholderTextColor="#999"
              value={newPost}
              onChangeText={setNewPost}
              multiline
            />
          </View>

          <View style={styles.createFooter}>
            <Text style={styles.musicHint}>
              ♫ Share your music feelings
            </Text>

            <TouchableOpacity
              style={styles.postButton}
              onPress={createPost}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEED TITLE */}
        <View style={styles.feedHeader}>
          <Text style={styles.sectionTitle}>Community Feed</Text>
          <Text style={styles.feedSubtitle}>
            See what others are listening to
          </Text>
        </View>

        {/* POSTS */}
        {filteredPosts.length === 0 ? (
          <Text style={styles.emptyText}>No posts found.</Text>
        ) : (
          filteredPosts.map(post => (
            <View key={post.id} style={styles.postCard}>

              {/* USER INFORMATION */}
              <View style={styles.userRow}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: post.color },
                  ]}
                >
                  <Ionicons name="person" size={25} color="#FFFFFF" />
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{post.name}</Text>
                  <Text style={styles.userTime}>
                    {post.username} · {post.time}
                  </Text>
                </View>

                {/* EDIT AND DELETE POST */}
                <View style={styles.postActions}>
                  <TouchableOpacity
                    onPress={() => {
                      cancelDeletePost();
                      startEditPost(post);
                    }}
                    hitSlop={10}
                    accessibilityLabel="Edit post"
                  >
                    <Ionicons
                      name="create-outline"
                      size={21}
                      color="#D94F82"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => requestDeletePost(post.id)}
                    hitSlop={10}
                    accessibilityLabel="Delete post"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={21}
                      color="#E45B5B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* DELETE CONFIRMATION */}
              {deletingPostId === post.id && (
                <View style={styles.deleteConfirm}>
                  <Text style={styles.deleteConfirmText}>
                    Delete this post?
                  </Text>

                  <View style={styles.deleteConfirmActions}>
                    <TouchableOpacity
                      style={styles.deleteConfirmButton}
                      onPress={() => deletePost(post.id)}
                    >
                      <Text style={styles.deleteConfirmButtonText}>
                        Delete
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={cancelDeletePost}>
                      <Text style={styles.cancelEditText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* POST MESSAGE */}
              {editingPostId === post.id ? (
                <View style={styles.editPostContainer}>
                  <TextInput
                    style={styles.editPostInput}
                    value={editPostText}
                    onChangeText={setEditPostText}
                    placeholder="Edit your post..."
                    placeholderTextColor="#999"
                    multiline
                    autoFocus
                  />

                  <View style={styles.editActions}>
                    <TouchableOpacity onPress={saveEditPost}>
                      <Text style={styles.saveEditText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={cancelEditPost}>
                      <Text style={styles.cancelEditText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={styles.postMessage}>
                  {post.message}
                </Text>
              )}

              {/* MUSIC CARD */}
              <View
                style={[
                  styles.musicCard,
                  { backgroundColor: post.color },
                ]}
              >
                <View style={styles.albumIcon}>
                  <Ionicons
                    name="musical-notes"
                    size={42}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.musicInfo}>
                  <Text style={styles.songName}>{post.song}</Text>
                  <Text style={styles.artistName}>{post.artist}</Text>
                  <Text style={styles.sharedLabel}>
                    ♫ MUSIC SHARED
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'MeloShare',
                      'Music playback will be added soon.'
                    )
                  }
                >
                  <Ionicons
                    name="play-circle"
                    size={42}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              {/* LIKE AND COMMENT COUNTS */}
              <View style={styles.countRow}>
                <Text style={styles.countText}>
                  ❤️ {post.likes} likes
                </Text>

                <Text style={styles.countText}>
                  {post.comments.length} comments
                </Text>
              </View>

              {activeReactionPostId === post.id && (
                <View style={styles.reactionContainer}>
                  {reactionOptions.map(reaction => (
                    <TouchableOpacity
                      key={reaction}
                      style={[
                        styles.reactionButton,
                        post.userReaction === reaction &&
                          styles.selectedReaction,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`React with ${reaction}`}
                      onPress={() => {
                        toggleReaction(post.id, reaction);
                        setActiveReactionPostId(null);
                      }}
                    >
                      <Text style={styles.reactionEmoji}>{reaction}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* ACTION BUTTONS */}
              <View style={styles.actionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                  onPress={() => {
                    setActiveReactionPostId(null);
                    toggleLike(post.id);
                  }}
                  onLongPress={() => setActiveReactionPostId(post.id)}
                  accessibilityRole="button"
                  accessibilityHint="Long press to choose a reaction"
                >
                  <Ionicons
                    name={post.liked ? 'heart' : 'heart-outline'}
                    size={21}
                    color={post.liked ? '#D94F82' : '#BBBBBB'}
                  />

                  <Text
                    style={[
                      styles.actionText,
                      post.liked && styles.likedText,
                    ]}
                  >
                    Like
                  </Text>
                </Pressable>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleComments(post.id)}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#BBBBBB"
                  />

                  <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    Alert.alert(
                      'Share',
                      'Post sharing will be added soon.'
                    )
                  }
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="#BBBBBB"
                  />

                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>

              {/* COMMENTS */}
              {openComments.includes(post.id) && (
                <View style={styles.commentSection}>

                  {post.comments.map(comment => (
                    <View
                      key={comment.id}
                      style={styles.commentItem}
                    >
                      <View style={styles.commentContent}>
                        <Text style={styles.commentName}>
                          {comment.name}:
                        </Text>

                        {editingComment?.postId === post.id &&
                        editingComment?.commentId === comment.id ? (
                          <View style={styles.editCommentContainer}>
                            <TextInput
                              style={styles.editCommentInput}
                              value={editCommentText}
                              onChangeText={setEditCommentText}
                              multiline
                              autoFocus
                            />

                            <View style={styles.editActions}>
                              <TouchableOpacity
                                onPress={saveEditComment}
                              >
                                <Text style={styles.saveEditText}>
                                  Save
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={cancelEditComment}
                              >
                                <Text style={styles.cancelEditText}>
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <Text style={styles.commentText}>
                            {comment.text}
                          </Text>
                        )}
                      </View>

                      {/* EDIT AND DELETE OWN COMMENTS */}
                      {comment.name === 'You' && (
                        <View style={styles.commentActions}>
                          <TouchableOpacity
                            onPress={() =>
                              startEditComment(post.id, comment)
                            }
                          >
                            <Ionicons
                              name="create-outline"
                              size={19}
                              color="#D94F82"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              deleteComment(post.id, comment.id)
                            }
                          >
                            <Ionicons
                              name="trash-outline"
                              size={19}
                              color="#E45B5B"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}

                  {/* ADD COMMENT */}
                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Write a comment..."
                      placeholderTextColor="#999"
                      value={commentInputs[post.id] || ''}
                      onChangeText={value =>
                        setCommentInputs(current => ({
                          ...current,
                          [post.id]: value,
                        }))
                      }
                    />

                    <TouchableOpacity
                      onPress={() => addComment(post.id)}
                    >
                      <Ionicons
                        name="send"
                        size={23}
                        color="#D94F82"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 35 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151219',
    paddingHorizontal: 18,
  },
  header: {
    marginTop: 55,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#D94F82',
  },
  tagline: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
  },
  iconButton: {
    backgroundColor: '#29232D',
    padding: 11,
    borderRadius: 25,
  },
  searchBox: {
    height: 50,
    backgroundColor: '#29232D',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    marginLeft: 9,
    fontSize: 13,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  description: {
    color: '#999',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 20,
  },
  createCard: {
    backgroundColor: '#29232D',
    padding: 15,
    borderRadius: 15,
    marginBottom: 27,
  },
  createTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 13,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myAvatar: {
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: '#D94F82',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFF',
    fontSize: 13,
    minHeight: 43,
  },
  createFooter: {
    borderTopWidth: 1,
    borderTopColor: '#443A48',
    marginTop: 12,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  musicHint: {
    color: '#D9A0B6',
    fontSize: 11,
  },
  postButton: {
    backgroundColor: '#D94F82',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  feedHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: 'bold',
  },
  feedSubtitle: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  postCard: {
    backgroundColor: '#29232D',
    padding: 15,
    borderRadius: 16,
    marginBottom: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 11,
  },
  userName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userTime: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
  },
  postMessage: {
    color: '#F4F0F4',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 15,
    marginBottom: 13,
  },
  musicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 12,
  },
  albumIcon: {
    width: 65,
    height: 65,
    borderRadius: 9,
    backgroundColor: '#FFFFFF33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  musicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  artistName: {
    color: '#F9E3EC',
    fontSize: 11,
    marginTop: 4,
  },
  sharedLabel: {
    color: '#FFE3EF',
    fontSize: 9,
    marginTop: 7,
    fontWeight: 'bold',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#443A48',
  },
  countText: {
    color: '#AAA',
    fontSize: 11,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 13,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: '#BBB',
    fontSize: 12,
  },
  likedText: {
    color: '#D94F82',
  },
  commentSection: {
    borderTopWidth: 1,
    borderTopColor: '#443A48',
    marginTop: 13,
    paddingTop: 12,
  },
  commentText: {
    color: '#DDD',
    fontSize: 12,
    marginBottom: 10,
  },
  commentName: {
    color: '#D94F82',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 3,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A313E',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    height: 42,
    color: '#FFF',
    fontSize: 12,
  },
  emptyText: {
    color: '#AAA',
    textAlign: 'center',
    padding: 25,
  },

  // EMOJI REACTIONS
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 5,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A313E',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  selectedReaction: {
    backgroundColor: '#603448',
    borderWidth: 1,
    borderColor: '#D94F82',
  },
  reactionEmoji: {
    fontSize: 17,
  },
  // EDIT AND DELETE COMMENTS
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  commentContent: {
    flex: 1,
    marginRight: 10,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingTop: 3,
  },
  editCommentContainer: {
    marginTop: 5,
  },
  editCommentInput: {
    backgroundColor: '#3A313E',
    color: '#FFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    minHeight: 40,
  },
  editActions: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 8,
  },
  saveEditText: {
    color: '#D94F82',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelEditText: {
    color: '#AAA',
    fontSize: 12,
  },

  // EDIT AND DELETE POSTS
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deleteConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3A2530',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  deleteConfirmText: {
    color: '#FFD6D6',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteConfirmActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deleteConfirmButton: {
    backgroundColor: '#E45B5B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  deleteConfirmButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editPostContainer: {
    marginTop: 15,
    marginBottom: 13,
  },
  editPostInput: {
    backgroundColor: '#3A313E',
    color: '#FFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});