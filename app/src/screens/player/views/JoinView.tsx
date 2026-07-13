import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Participant } from '../../../types';

interface JoinViewProps {
  participants: Participant[];
  onJoin: (participantId: string, name: string) => void;
}

export function JoinView({ participants, onJoin }: JoinViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 이름을 선택하세요</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.nameButton, item.claimed && styles.nameButtonDisabled]}
            disabled={item.claimed}
            onPress={() => onJoin(item.id, item.name)}
          >
            <Text style={styles.nameText}>{item.name}</Text>
            {item.claimed ? <Text style={styles.takenLabel}>입장함</Text> : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#232320', textAlign: 'center', marginBottom: 16 },
  list: { gap: 12 },
  row: { gap: 12 },
  nameButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  nameButtonDisabled: { opacity: 0.4 },
  nameText: { fontSize: 16, fontWeight: '600', color: '#232320' },
  takenLabel: { fontSize: 12, color: '#9a9488', marginTop: 4 },
});
