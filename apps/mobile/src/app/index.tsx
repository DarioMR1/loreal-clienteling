import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Sidebar } from '@/components/layout/sidebar';
import { SplitView } from '@/components/layout/split-view';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/hooks/use-theme';
import type { Appointment, Client, Product, SidebarSection } from '@/types';

// Features
import { AppointmentDetail } from '@/features/appointments/appointment-detail';
import { AppointmentList } from '@/features/appointments/appointment-list';
import { ClientList } from '@/features/client-book/client-list';
import { ClientProfile } from '@/features/client-book/client-profile';
import { Dashboard } from '@/features/performance/dashboard';
import { ProductDetail } from '@/features/product-catalog/product-detail';
import { ProductGrid } from '@/features/product-catalog/product-grid';
import { SettingsScreen } from '@/features/settings/settings-screen';

export default function HomeScreen() {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState<SidebarSection>('client-book');

  // Selection state per module
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'client-book':
        return (
          <SplitView
            master={
              <ClientList
                selectedId={selectedClient?.id ?? null}
                onSelect={setSelectedClient}
              />
            }
            detail={
              selectedClient ? (
                <ClientProfile client={selectedClient} />
              ) : (
                <EmptyState
                  icon="person"
                  title="Selecciona un cliente"
                  message="Elige un cliente de la lista para ver su perfil completo"
                />
              )
            }
          />
        );

      case 'appointments':
        return (
          <SplitView
            master={
              <AppointmentList
                selectedId={selectedAppointment?.id ?? null}
                onSelect={setSelectedAppointment}
              />
            }
            detail={
              selectedAppointment ? (
                <AppointmentDetail appointment={selectedAppointment} />
              ) : (
                <EmptyState
                  icon="calendar"
                  title="Selecciona una cita"
                  message="Elige una cita de la lista para ver los detalles"
                />
              )
            }
          />
        );

      case 'product-catalog':
        return (
          <SplitView
            master={
              <ProductGrid
                selectedId={selectedProduct?.id ?? null}
                onSelect={setSelectedProduct}
              />
            }
            detail={
              selectedProduct ? (
                <ProductDetail product={selectedProduct} />
              ) : (
                <EmptyState
                  icon="bag"
                  title="Selecciona un producto"
                  message="Elige un producto del catalogo para ver su ficha"
                />
              )
            }
          />
        );

      case 'performance':
        return <Dashboard />;

      case 'settings':
        return <SettingsScreen />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.layout}>
        <Sidebar
          active={activeSection}
          onSelect={(section) => {
            setActiveSection(section);
            // Reset selection when switching sections
            setSelectedClient(null);
            setSelectedAppointment(null);
            setSelectedProduct(null);
          }}
        />
        <View style={styles.content}>
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
