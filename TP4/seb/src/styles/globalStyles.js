import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A', 
  },

  header: { 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#1A1A1A', 
  },
  headerTitle: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#E0E0E0', 
    letterSpacing: 0.5, 
  },


  statusContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 'auto', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
  },
  statusIndicator: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 6,
  },
  statusText: { 
    fontSize: 11, 
    color: '#9E9E9E',
    fontWeight: '500',
    textTransform: 'uppercase',
  },


  listContainer: { 
    padding: 20, 
  },
  

  footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#1A1A1A', 
    backgroundColor: '#0A0A0A', 
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonDisabled: { 
    backgroundColor: '#2E7D32',
    shadowOpacity: 0.1,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700', 
    marginLeft: 10,
  },


  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: '30%', 
  },
  emptyText: { 
    color: '#616161', 
    marginTop: 20, 
    textAlign: 'center', 
    paddingHorizontal: 40,
    fontSize: 16,
    lineHeight: 24,
  },


  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: { 
    color: '#BDBDBD', 
    fontSize: 14, 
    fontWeight: '500', 
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardTxnId: { 
    color: '#616161', 
    fontSize: 12, 
    marginBottom: 16, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  timelineContainer: { 
    borderLeftWidth: 2, 
    borderLeftColor: '#2A2A2A', 
    paddingLeft: 20, 
    marginLeft: 10, 
  },
  timelineItem: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 20, 
    position: 'relative',
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -42,
    top: 0,
    borderWidth: 4,
    borderColor: '#0A0A0A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  timelineContent: { flex: 1 },
  timelineTitle: { 
    color: '#F5F5F5', 
    fontWeight: '600', 
    fontSize: 15,
  },
  timelineSubtitle: { 
    color: '#9E9E9E', 
    fontSize: 12, 
    marginTop: 4, 
    lineHeight: 18,
  },
});