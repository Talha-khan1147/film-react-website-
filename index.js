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

  RootComponent = function MobileContainer() {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    let devHost = 'localhost:8081';
    if (scriptURL) {
      try {
        devHost = scriptURL.split('://')[1].split('/')[0];
      } catch (e) {
        // fallback
      }
    }

    const defaultUrl = `http://${devHost}`;
    const [hasError, setHasError] = useState(false);
    const [key, setKey] = useState(0);

    if (hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.title}>AuraChat Mobile</Text>
          <Text style={styles.subtitle}>
            Waiting for web server at {defaultUrl}
          </Text>
          <Text style={styles.help}>
            Start the web server by pressing &quot;w&quot; in the terminal or running:
            {"\n"}npx expo start --web
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setKey((k) => k + 1);
            }}
          >
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <WebView
          key={key}
          source={{ uri: defaultUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Connecting to AuraChat...</Text>
            </View>
          )}
          onError={() => setHasError(true)}
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
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 12,
    },
    help: {
      color: '#94A3B8',
      fontSize: 13,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: '#6366F1',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
  });
} else {
  const App = require('./src/App').default || require('./src/App').App;
  RootComponent = App;
}

registerRootComponent(RootComponent);
