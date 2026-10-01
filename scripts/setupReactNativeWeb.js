const fs = require('fs');
const path = require('path');

const moduleMap = require('../node_modules/babel-plugin-react-native-web/src/moduleMap.js');

const exportsDir = path.join(__dirname, '../node_modules/react-native-web/dist/exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Specialized implementations
const specialModules = {
  NativeEventEmitter: `
'use strict';
class NativeEventEmitter {
  constructor(nativeModule) {
    this.nativeModule = nativeModule;
  }
  addListener(eventType, listener, context) {
    return { remove: () => {} };
  }
  removeListener(eventType, listener) {}
  removeAllListeners(eventType) {}
  emit(eventType, ...args) {}
}
module.exports = NativeEventEmitter;
module.exports.default = NativeEventEmitter;
`,
  NativeModules: `
'use strict';
const NativeModules = {};
module.exports = NativeModules;
module.exports.default = NativeModules;
`,
  DeviceEventEmitter: `
'use strict';
const DeviceEventEmitter = {
  addListener: (event, listener) => ({ remove: () => {} }),
  emit: () => {},
  removeAllListeners: () => {},
};
module.exports = DeviceEventEmitter;
module.exports.default = DeviceEventEmitter;
`,
  AppState: `
'use strict';
const AppState = {
  currentState: 'active',
  addEventListener: (type, handler) => ({ remove: () => {} }),
  removeEventListener: (type, handler) => {},
};
module.exports = AppState;
module.exports.default = AppState;
`,
  Appearance: `
'use strict';
const Appearance = {
  getColorScheme: () => 'dark',
  addChangeListener: (listener) => ({ remove: () => {} }),
};
module.exports = Appearance;
module.exports.default = Appearance;
`,
  BackHandler: `
'use strict';
const BackHandler = {
  addEventListener: (eventName, handler) => ({ remove: () => {} }),
  removeEventListener: (eventName, handler) => {},
  exitApp: () => {},
};
module.exports = BackHandler;
module.exports.default = BackHandler;
`,
  UIManager: `
'use strict';
const UIManager = {
  getViewManagerConfig: () => null,
  measure: () => {},
  measureInWindow: () => {},
  measureLayout: () => {},
};
module.exports = UIManager;
module.exports.default = UIManager;
`,
  PixelRatio: `
'use strict';
const PixelRatio = {
  get: () => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
  getFontScale: () => 1,
  getPixelSizeForLayoutSize: (size) => size,
  roundToNearestPixel: (size) => size,
};
module.exports = PixelRatio;
module.exports.default = PixelRatio;
`,
  I18nManager: `
'use strict';
const I18nManager = {
  isRTL: false,
  allowRTL: () => {},
  forceRTL: () => {},
};
module.exports = I18nManager;
module.exports.default = I18nManager;
`,
  Linking: `
'use strict';
const Linking = {
  openURL: (url) => {
    if (typeof window !== 'undefined') window.open(url, '_blank');
    return Promise.resolve();
  },
  canOpenURL: () => Promise.resolve(true),
  getInitialURL: () => Promise.resolve(typeof window !== 'undefined' ? window.location.href : null),
  addEventListener: () => ({ remove: () => {} }),
};
module.exports = Linking;
module.exports.default = Linking;
`,
  Alert: `
'use strict';
const Alert = {
  alert: (title, message) => {
    if (typeof window !== 'undefined') window.alert(\`\${title}\\n\${message || ''}\`);
  },
};
module.exports = Alert;
module.exports.default = Alert;
`,
  Animated: `
'use strict';
const React = require('react');
const Animated = {
  Value: function(v) { this.value = v; this.setValue = (val) => { this.value = val; }; },
  ValueXY: function(v) { this.x = v?.x || 0; this.y = v?.y || 0; },
  timing: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  spring: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  decay: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  sequence: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  parallel: () => ({ start: (cb) => cb && cb({ finished: true }) }),
  View: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
  Text: React.forwardRef((props, ref) => React.createElement('span', { ...props, ref })),
  Image: React.forwardRef((props, ref) => React.createElement('img', { ...props, ref })),
  ScrollView: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
  createAnimatedComponent: (Comp) => Comp,
};
module.exports = Animated;
module.exports.default = Animated;
`,
  findNodeHandle: `
'use strict';
module.exports = () => null;
module.exports.default = module.exports;
`,
  processColor: `
'use strict';
module.exports = (color) => color;
module.exports.default = module.exports;
`,
  createElement: `
'use strict';
const React = require('react');
module.exports = React.createElement;
module.exports.default = React.createElement;
`,
  useColorScheme: `
'use strict';
module.exports = () => 'dark';
module.exports.default = module.exports;
`,
  useWindowDimensions: `
'use strict';
module.exports = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 375,
  height: typeof window !== 'undefined' ? window.innerHeight : 812,
  scale: 1,
  fontScale: 1,
});
module.exports.default = module.exports;
`,
  ActivityIndicator: `
'use strict';
const React = require('react');
const ActivityIndicator = React.forwardRef((props, ref) => React.createElement('div', { ...props, ref, className: 'activity-indicator' }));
module.exports = ActivityIndicator;
module.exports.default = ActivityIndicator;
`,
  FlatList: `
'use strict';
const React = require('react');
const FlatList = React.forwardRef((props, ref) => {
  const { data = [], renderItem, keyExtractor = (item, i) => i } = props;
  return React.createElement('div', { ref, style: props.style },
    data.map((item, index) => renderItem({ item, index, separators: {} }))
  );
});
module.exports = FlatList;
module.exports.default = FlatList;
`,
  SectionList: `
'use strict';
const React = require('react');
const SectionList = React.forwardRef((props, ref) => React.createElement('div', { ...props, ref }));
module.exports = SectionList;
module.exports.default = SectionList;
`,
  Modal: `
'use strict';
const React = require('react');
const Modal = (props) => props.visible ? React.createElement('div', { style: { position: 'fixed', inset: 0, zIndex: 9999 } }, props.children) : null;
module.exports = Modal;
module.exports.default = Modal;
`,
};

// Generic React component for UI elements
const genericComponent = (name) => `
'use strict';
const React = require('react');
const ${name} = React.forwardRef((props, ref) => React.createElement('div', { ...props, ref }));
module.exports = ${name};
module.exports.default = ${name};
`;

// Generic object for APIs
const genericObject = (name) => `
'use strict';
const ${name} = {};
module.exports = ${name};
module.exports.default = ${name};
`;

const uiNames = new Set([
  'Button', 'CheckBox', 'ImageBackground', 'InputAccessoryView', 'KeyboardAvoidingView',
  'Picker', 'ProgressBar', 'RefreshControl', 'Switch', 'Touchable', 'TouchableHighlight',
  'TouchableNativeFeedback', 'TouchableWithoutFeedback', 'VirtualizedList'
]);

for (const name of Object.keys(moduleMap)) {
  const modDir = path.join(exportsDir, name);
  if (!fs.existsSync(modDir)) {
    fs.mkdirSync(modDir, { recursive: true });
  }

  let code;
  if (specialModules[name]) {
    code = specialModules[name].trim();
  } else if (fs.existsSync(path.join(modDir, 'index.js'))) {
    // Keep existing implementation
    continue;
  } else if (uiNames.has(name)) {
    code = genericComponent(name).trim();
  } else {
    code = genericObject(name).trim();
  }

  // Write both dist/exports/Name/index.js and dist/exports/Name.js
  fs.writeFileSync(path.join(modDir, 'index.js'), code);
  fs.writeFileSync(path.join(exportsDir, `${name}.js`), code);
}

console.log('Successfully generated all react-native-web exports!');
