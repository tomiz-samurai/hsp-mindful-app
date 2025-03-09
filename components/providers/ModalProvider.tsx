import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ModalContextType {
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const insets = useSafeAreaInsets();
  
  const showModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  };
  
  const hideModal = () => {
    setIsVisible(false);
    // アニメーション完了後にコンテンツをクリア
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };
  
  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Portal>
        <Modal
          visible={isVisible}
          transparent
          animationType="fade"
          onRequestClose={hideModal}
        >
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View 
                  style={[
                    styles.modalContent,
                    { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }
                  ]}
                >
                  {modalContent}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </ModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
});
