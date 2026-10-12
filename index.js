import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import {
  Platform,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  NativeModules,
} from 'react-native';

let RootComponent;

if (Platform.OS !== 'web') {
  const { WebView } = require('react-native-webview');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const { TextInput } = require('react-native');

  const CLOUD_URL = 'https://chatting-5b811.web.app';
  const STORAGE_KEY = 'aurachat_mobile_server_url';

  RootComponent = function MobileContainer() {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    let devHost = null;
    if (scriptURL) {
      try {
        const rawHost = scriptURL.split('://')[1]?.split('/')[0];
        const ip = rawHost?.split(':')[0];
        // If it's a real LAN IP (not localhost/127.0.0.1), use Vite dev server port 3000
        if (ip && !ip.startsWith('localhost') && !ip.startsWith('127.0.0.1')) {
          devHost = `${ip}:3000`;
        }
      } catch (e) {
        // fallback
      }
    }

    // Default to devHost if a valid LAN IP was detected in dev mode; otherwise default to CLOUD_URL
    const initialUrl = devHost ? `http://${devHost}` : CLOUD_URL;

    const [currentUrl, setCurrentUrl] = useState(initialUrl);
    const [customIpInput, setCustomIpInput] = useState('');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [key, setKey] = useState(0);

    React.useEffect(() => {
      // Check if user previously saved a custom server URL
      AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
        if (saved) {
          setCurrentUrl(saved);
        }
      }).catch(() => {});
    }, []);

    const handleSwitchToCloud = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, CLOUD_URL);
      } catch (e) {}
      setCurrentUrl(CLOUD_URL);
      setHasError(false);
      setKey((k) => k + 1);
    };

    const handleSwitchToLocal = async () => {
      if (devHost) {
        const target = `http://${devHost}`;
        try {
          await AsyncStorage.setItem(STORAGE_KEY, target);
        } catch (e) {}
        setCurrentUrl(target);
        setHasError(false);
        setKey((k) => k + 1);
      }
    };

    const handleResetUrl = async () => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      setCurrentUrl(initialUrl);
      setHasError(false);
      setKey((k) => k + 1);
    };

    const handleConnectCustom = async () => {
      let target = customIpInput.trim();
      if (!target) return;
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = `http://${target}`;
      }
      try {
        await AsyncStorage.setItem(STORAGE_KEY, target);
      } catch (e) {}
      setCurrentUrl(target);
      setHasError(false);
      setKey((k) => k + 1);
    };

    if (hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.title}>AuraChat Mobile</Text>
          <Text style={styles.subtitle}>
            Unable to connect to:{"\n"}
            <Text style={{ color: '#60A5FA', fontWeight: 'bold' }}>{currentUrl}</Text>
          </Text>

          {devHost && currentUrl !== `http://${devHost}` && (
            <TouchableOpacity
              style={styles.localButton}
              onPress={handleSwitchToLocal}
            >
              <Text style={styles.localButtonText}>⚡ Connect to Local PC Dev Server ({devHost})</Text>
            </TouchableOpacity>
          )}

          {currentUrl !== CLOUD_URL && (
            <TouchableOpacity
              style={styles.cloudButton}
              onPress={handleSwitchToCloud}
            >
              <Text style={styles.cloudButtonText}>☁️ Connect to Live Cloud Server</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setKey((k) => k + 1);
            }}
          >
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>

          <View style={styles.customIpBox}>
            <Text style={styles.customIpLabel}>Or enter your PC's LAN IP and port:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 192.168.1.100:3000"
              placeholderTextColor="#64748B"
              value={customIpInput}
              onChangeText={setCustomIpInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.customConnectBtn}
              onPress={handleConnectCustom}
            >
              <Text style={styles.customConnectText}>Connect to IP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetUrl}
            >
              <Text style={styles.resetText}>Reset to Default</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <WebView
          key={key}
          source={{ uri: currentUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowFileAccess={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="always"
          cacheEnabled={false}
          userAgent="Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Connecting to AuraChat...</Text>
            </View>
          )}
          onError={(e) => {
            setErrorMessage(e.nativeEvent?.description || 'Connection failed');
            // If local connection failed and we were not already on CLOUD_URL, auto-switch to CLOUD_URL
            if (currentUrl !== CLOUD_URL) {
              console.log('Local server connection failed, falling back to Cloud Server...');
              setCurrentUrl(CLOUD_URL);
              setKey((k) => k + 1);
            } else {
              setHasError(true);
            }
          }}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0B0F19',
    },
    webview: {
      flex: 1,
      backgroundColor: '#0B0F19',
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#0B0F19',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: '#94A3B8',
      marginTop: 12,
      fontSize: 14,
    },
    errorContainer: {
      flex: 1,
      backgroundColor: '#0B0F19',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitle: {
      color: '#F59E0B',
      fontSize: 13,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 18,
    },
    localButton: {
      backgroundColor: '#6366F1',
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 10,
      width: '100%',
      alignItems: 'center',
    },
    localButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
    cloudButton: {
      backgroundColor: '#10B981',
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 12,
      width: '100%',
      alignItems: 'center',
    },
    cloudButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
    retryButton: {
      backgroundColor: '#334155',
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    customIpBox: {
      width: '100%',
      padding: 16,
      backgroundColor: '#1E293B',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#334155',
    },
    customIpLabel: {
      color: '#94A3B8',
      fontSize: 12,
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#334155',
    },
    customConnectBtn: {
      backgroundColor: '#3B82F6',
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      marginBottom: 8,
    },
    customConnectText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    resetBtn: {
      paddingVertical: 6,
      alignItems: 'center',
    },
    resetText: {
      color: '#94A3B8',
      fontSize: 12,
    },
  });
} else {
  const App = require('./src/App').default || require('./src/App').App;
  RootComponent = App;
}

registerRootComponent(RootComponent);
