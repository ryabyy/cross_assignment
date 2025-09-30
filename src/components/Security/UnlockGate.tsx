import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styles } from './UnlockGate.styles';

interface UnlockGateProps {
  children: React.ReactNode;
}

const UnlockGate: React.FC<UnlockGateProps> = ({ children }) => {
  const { isUnlocked, requestUnlock, biometryAvailable, initialized } = useAuth();
  const [show, setShow] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    const shouldShow = initialized && !isUnlocked && biometryAvailable;
    console.debug('[UnlockGate] isUnlocked:', isUnlocked, 'biometryAvailable:', biometryAvailable, '-> show:', shouldShow);
    setShow(shouldShow);
  }, [initialized, isUnlocked, biometryAvailable]);

  useEffect(() => {
    if (show && !attemptedRef.current) {
      attemptedRef.current = true;
      requestUnlock().finally(() => {
        attemptedRef.current = false;
      });
    }
  }, [show, requestUnlock]);

  if (!initialized) {
    return (
      <Modal visible transparent animationType="none" onRequestClose={() => {}}>
        <View style={styles.overlay} />
      </Modal>
    );
  }

  if (isUnlocked || !biometryAvailable) {
    console.debug('[UnlockGate] Unlocked or biometrics unavailable -> rendering children');
    return <>{children}</>;
  }

  return (
    <>
      <Modal visible={show} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Unlock</Text>
            <Text style={styles.text}>Use your fingerprint to continue</Text>
            <TouchableOpacity style={styles.button} onPress={() => { console.debug('[UnlockGate] Unlock button pressed'); requestUnlock(); }}>
              <Text style={styles.buttonText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

 

export default UnlockGate;
