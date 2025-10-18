import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../src/hooks/useCartStore';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { strapi } from '../src/api/strapi';
import Colors from '../src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Definimos una lista simulada de métodos de pago para la UI.
const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Tarjeta de Crédito', icon: 'card-outline' },
  { id: 'debit_card', name: 'Tarjeta de Débito', icon: 'card' },
  { id: 'digital_wallet', name: 'Billetera Virtual', icon: 'wallet-outline' },
];

// Pantalla final del proceso de compra. Aquí el usuario revisa su pedido, selecciona un método de pago y confirma la compra.
export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(PAYMENT_METHODS[0].id);
  const [isLoading, setIsLoading] = useState(false);


  const handlePlaceOrder = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Por favor, selecciona un método de pago.');
      return;
    }
    setIsLoading(true);
    try {

      const orderData = {
        data: {
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          paymentMethod: selectedMethod,
          shippingAddress: { 
            street: 'Calle Falsa 123',
            city: 'Springfield',
            country: 'Argentina',
            zipCode: 'B1876',
          },
        },
      };


      await strapi.createOrder(orderData);
      

      Alert.alert(
        '¡Compra exitosa!',
        `Tu pedido ha sido procesado correctamente. Gracias por tu compra, ${user?.username}.`,
        [
          {
            text: 'Volver a la Tienda',
            onPress: () => {
              clearCart();
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error en la compra', error.response?.data?.error?.message || 'No se pudo procesar tu pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Productos ({items.length})</Text>
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío</Text>
          <Text style={styles.summaryValue}>Gratis</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Pago</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.paymentOption}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Ionicons name={method.icon as any} size={24} color={Colors.text} style={styles.paymentIcon} />
            <Text style={styles.paymentName}>{method.name}</Text>
            <View style={styles.radioOuter}>
              {selectedMethod === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {}
      <TouchableOpacity
        style={[styles.checkoutButton, isLoading && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.card} />
        ) : (
          <Text style={styles.checkoutButtonText}>Pagar ${totalPrice.toFixed(2)}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  }
});