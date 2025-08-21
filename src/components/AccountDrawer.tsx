import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { X, Settings, User, Bell, Plus, LogOut, ChevronRight, HelpCircle } from 'lucide-react-native';
import tw from '../lib/tw';
import { useRef, useEffect } from 'react';

interface AccountDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function AccountDrawer({ visible, onClose }: AccountDrawerProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      // Start from bottom (hidden)
      slideAnim.setValue(height);
      // Animate to top (visible)
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 12,
      }).start();
    } else {
      // Animate back to bottom (hidden)
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 50,
        friction: 12,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    onClose();
  };

  const handleItemPress = (itemName: string) => {
    console.log(`Navigating to: ${itemName}`);
    // TODO: Implement navigation to specific pages
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={tw`flex-1 bg-black bg-opacity-50`}>
        <TouchableOpacity 
          style={tw`flex-1`} 
          onPress={handleClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            tw`bg-neutral-900 rounded-t-3xl border-t border-neutral-800`,
            {
              transform: [{ translateY: slideAnim }],
              maxHeight: height * 0.7,
            }
          ]}
        >
          {/* Header */}
          <View style={tw`flex-row items-center justify-between px-8 py-4 border-b border-neutral-800`}>
            <Text style={tw`text-xl font-semibold text-neutral-100`}>Account</Text>
            <TouchableOpacity onPress={handleClose} style={tw`p-2`}>
              <X size={24} color="#f3f4f6" />
            </TouchableOpacity>
          </View>

          {/* Content with separator lines */}
          <View style={tw`px-8 pb-4`}>
            {/* Profile */}
            <TouchableOpacity 
              style={tw`flex-row items-center py-4 border-b border-neutral-800`}
              onPress={() => handleItemPress('Profile')}
            >
              <User size={20} color="#9ca3af" style={tw`mr-3`} />
              <Text style={tw`text-neutral-100 flex-1`}>Profile</Text>
              <ChevronRight size={16} color="#6b7280" />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity 
              style={tw`flex-row items-center py-4 border-b border-neutral-800`}
              onPress={() => handleItemPress('Notifications')}
            >
              <Bell size={20} color="#9ca3af" style={tw`mr-3`} />
              <Text style={tw`text-neutral-100 flex-1`}>Notifications</Text>
              <ChevronRight size={16} color="#6b7280" />
            </TouchableOpacity>

            {/* More Settings */}
            <TouchableOpacity 
              style={tw`flex-row items-center py-4 border-b border-neutral-800`}
              onPress={() => handleItemPress('More Settings')}
            >
              <Settings size={20} color="#9ca3af" style={tw`mr-3`} />
              <Text style={tw`text-neutral-100 flex-1`}>More Settings</Text>
              <ChevronRight size={16} color="#6b7280" />
            </TouchableOpacity>

            {/* Create your own DubClub CTA */}
            <TouchableOpacity 
              style={tw`flex-row items-center py-4 border-b border-neutral-800`}
              onPress={() => handleItemPress('Create DubClub')}
            >
              <Plus size={20} color="#9ca3af" style={tw`mr-3`} />
              <Text style={tw`text-neutral-100 flex-1`}>Create your own DubClub</Text>
              <ChevronRight size={16} color="#6b7280" />
            </TouchableOpacity>

            {/* Sign Out Button - Distinct section */}
            <View style={tw`mt-4 mb-6`}>
              <TouchableOpacity 
                style={tw`flex-row items-center justify-center py-4 px-4 rounded-lg border border-neutral-700 bg-neutral-800`}
                onPress={() => handleItemPress('Sign Out')}
              >
                <LogOut size={20} color="#ef4444" style={tw`mr-3`} />
                <Text style={tw`text-red-500 font-medium`}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
