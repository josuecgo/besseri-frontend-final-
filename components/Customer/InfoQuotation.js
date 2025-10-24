import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors';


const InfoRow = ({ icon, value, label }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || 'No especificado'}</Text>
  </View>
);


const StatusBadge = ({ status }) => {
  const statusStyle = styles[status] || styles.defaultStatus;
  return (
    <View style={[styles.statusBadge, statusStyle.container]}>
      <Text style={[styles.statusText, statusStyle.text]}>{status}</Text>
    </View>
  );
};

export const InfoQuote = ({ quotation }) => {
    
    
    const formattedDate = quotation?.createdAt 
        ? new Date(quotation.createdAt).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric'
          }) 
        : '';
    return (
  <View >
    <View style={styles.card}>
                   <Text style={styles.cardTitle}>Información del Vehículo</Text>
                   <InfoRow icon="🚗" label="Marca" value={quotation?.maker?.name} />
                   <InfoRow icon="📄" label="Modelo" value={quotation?.model?.name} />
                   <InfoRow icon="📅" label="Año" value={quotation?.year} />
                   <InfoRow icon="🔧" label="Categoría" value={quotation.category.name} />
                   <InfoRow icon="🔩" label="Sub-Categoría" value={quotation.subCategory.name} />
               </View>
   
            
               <View style={styles.card}>
                   <Text style={styles.cardTitle}>Estado de la Solicitud</Text>
                   <View style={styles.infoRow}>
                       <Text style={styles.infoIcon}>📊</Text>
                       <Text style={styles.infoLabel}>Estado:</Text>
                       <StatusBadge status={quotation.status} />
                   </View>
                   <InfoRow icon="🗓️" label="Fecha" value={formattedDate} />
               </View>
  </View>
)};



const styles = StyleSheet.create({
     container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    contentContainer: {
        padding:10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.bgColor,
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
       
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
       
        borderColor:Colors.bgColor,
        borderWidth:1
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.bgColor,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#010000ff',
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoIcon: {
        fontSize: 15,
        marginRight: 5,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color:Colors.placeholder,
        marginRight: 5,
    },
    infoValue: {
        fontSize: 14,
        color: Colors.bgColor,
        flex: 1, // Permite que el texto se ajuste si es largo
    },
    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginLeft: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    // Estilos para cada estado
    pendiente: {
        container: { backgroundColor: '#FFF3CD' },
        text: { color: '#856404' }
    },
    cotizado: {
        container: { backgroundColor: '#D4EDDA' },
        text: { color: '#155724' }
    },
    completado: {
        container: { backgroundColor: '#C3E6CB' },
        text: { color: '#155724' }
    },
    cancelado: {
        container: { backgroundColor: '#F8D7DA' },
        text: { color: '#721C24' }
    },
    defaultStatus: {
        container: { backgroundColor: '#E2E3E5' },
        text: { color: '#383D41' }
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'red',
    }
})