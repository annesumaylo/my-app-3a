import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  // PROFILE INFORMATION
  const [profile, setProfile] = useState({
    name: 'Mitch Ann Cenal',
    username: '@musiclover',
    bio: '',
  });

  // EDIT PROFILE STATES
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // START EDITING PROFILE
  const startEditProfile = () => {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setEditBio(profile.bio);
    setErrorMessage('');
    setIsEditing(true);
  };

  // SAVE EDITED PROFILE
  const saveProfile = () => {
    const name = editName.trim();
    const username = editUsername.trim().replace(/^@+/, '').replace(/\s+/g, '');

    if (!name) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    if (!username) {
      setErrorMessage('Username cannot be empty.');
      return;
    }

    setProfile({
      name,
      username: `@${username}`,
      bio: editBio.trim(),
    });

    setErrorMessage('');
    setIsEditing(false);
  };

  // CANCEL EDITING PROFILE
  const cancelEditProfile = () => {
    setErrorMessage('');
    setIsEditing(false);
  };

  const menuItems = [
    { icon: 'heart-outline' as const, title: 'Liked Songs', subtitle: 'Your favorite music' },
    { icon: 'musical-notes-outline' as const, title: 'My Playlists', subtitle: 'Your music collections' },
    { icon: 'time-outline' as const, title: 'Recently Played', subtitle: 'Your listening history' },
    { icon: 'settings-outline' as const, title: 'Settings', subtitle: 'Manage your account' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>My Profile</Text>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={55} color="#FFFFFF" />
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor="#777"
            />

            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="@username"
              placeholderTextColor="#777"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell people about your music taste..."
              placeholderTextColor="#777"
              multiline
            />

            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveProfile}
              >
                <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                <Text style={styles.editText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEditProfile}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>{profile.username}</Text>

            {profile.bio !== '' && (
              <Text style={styles.bio}>{profile.bio}</Text>
            )}

            <TouchableOpacity
              style={styles.editButton}
              onPress={startEditProfile}
            >
              <Ionicons name="create-outline" size={17} color="#FFFFFF" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.stat}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.stat}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Music</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => Alert.alert(item.title, 'This feature will be added soon.')}
        >
          <View style={styles.menuIcon}>
            <Ionicons name={item.icon} size={23} color="#D94F82" />
          </View>

          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => Alert.alert('Logout', 'Logout functionality will be connected to your authentication API.')}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>MeloShare Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151219',
    paddingHorizontal: 20,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 55,
    marginBottom: 25,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#D94F82',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },
  username: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D94F82',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 17,
  },
  editText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 7,
  },
  bio: {
    color: '#DDD',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
    lineHeight: 19,
  },
  editForm: {
    alignSelf: 'stretch',
    marginTop: 5,
  },
  inputLabel: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#3A313E',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  bioInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF7B7B',
    fontSize: 12,
    marginTop: 10,
  },
  editButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 18,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D94F82',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#AAAAAA',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#29232D',
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  separator: {
    width: 1,
    backgroundColor: '#514653',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#302934',
  },
  menuIcon: {
    width: 43,
    height: 43,
    backgroundColor: '#29232D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
    marginLeft: 13,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  menuSubtitle: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#D94F82',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 35,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  version: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 35,
    fontSize: 11,
  },
});