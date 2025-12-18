import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { openSettings } from 'react-native-permissions';
import { useLocation } from '../hooks/useLocation';

export const LocationScreenUpdate = () => {
  const navigation = useNavigation();
  const { getLocationHook, } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const success = await getLocationHook();

      if (success) {
        console.log('✅ Permission granted and location obtained');
        // Volver a la pantalla principal o home
        navigation.reset({
          routes: [{ name: 'Splash' }], // Ajusta según tu navegación
        });
      } else {
        console.log('❌ Permission denied');
        // El usuario denegó el permiso, se queda en esta pantalla
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSettings = async () => {
    await openSettings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icono de ubicación */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📍</Text>
        </View>

        {/* Título */}
        <Text style={styles.title}>Permiso de Ubicación</Text>

        {/* Descripción */}
        <Text style={styles.description}>
          Necesitamos acceso a tu ubicación para mostrarte servicios cercanos y
          ofrecerte una mejor experiencia.
        </Text>

        {/* Características */}
        <View style={styles.featuresContainer}>
          <FeatureItem text="Ver servicios cercanos a ti" />
          <FeatureItem text="Obtener mejores recomendaciones" />
          <FeatureItem text="Calcular tiempos de entrega precisos" />
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRequestPermission}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Permitir Acceso</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleOpenSettings}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>Abrir Configuración</Text>
        </TouchableOpacity>

        {/* Nota de privacidad */}
        <Text style={styles.privacyNote}>
          Tu privacidad es importante. Solo usamos tu ubicación cuando usas la
          app.
        </Text>
      </View>
    </View>
  );
};

const FeatureItem = ({ text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>✓</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 32,
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});