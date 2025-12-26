# Focus Screen - Legacy Implementation

**Fecha de backup:** 26 de Diciembre, 2025  
**Razón:** Reemplazo completo por nueva funcionalidad de Pomodoro Timer  
**Archivos respaldados:**

- `src/screens/FocusScreen.old.tsx`
- `__tests__/screens/FocusScreen.old.test.tsx`

---

## Descripción de la Funcionalidad Antigua

La pantalla Focus original mostraba una lista filtrada de tareas importantes basándose en dos criterios:

1. **Tareas de alta prioridad** (`priority === 'high'`)
2. **Tareas con vencimiento próximo** (dentro de las próximas 24 horas)

### Características

- ✅ Filtrado automático de tareas importantes
- ✅ Visualización de tareas con descripción
- ✅ Badges de lista con colores
- ✅ Formato de fechas (Today/Tomorrow/Date)
- ✅ Estado vacío cuando no hay tareas importantes
- ✅ Contador de tareas importantes en el header

### Componentes Principales

#### FocusScreen Component

- **Ubicación:** `src/screens/FocusScreen.old.tsx`
- **Líneas de código:** 221
- **Dependencias:**
  - `react-native` (View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView)
  - `react-native-vector-icons/Ionicons`
  - `../data/mockData` (focusTasks, mockLists)

#### Funciones Helper

1. **`getListName(listId: string)`**

   - Obtiene el nombre de la lista por ID
   - Retorna "Unknown" si no encuentra la lista

2. **`getListColor(listId: string)`**

   - Obtiene el color de la lista por ID
   - Retorna "#007AFF" por defecto

3. **`formatDate(date: Date | undefined)`**

   - Formatea fechas como "Today", "Tomorrow", o "MMM DD"
   - Maneja fechas undefined

4. **`renderFocusTask({item})`**
   - Renderiza cada tarea en la lista
   - Muestra título, descripción, lista, y fecha de vencimiento

### Lógica de Filtrado

El filtrado de tareas se realizaba en `src/data/mockData.ts`:

```typescript
export const focusTasks = mockTasks.filter(
  task =>
    !task.completed &&
    (task.priority === 'high' ||
      (task.dueDate &&
        new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000))),
);
```

**Criterios:**

- Tarea no completada (`!task.completed`)
- Y uno de los siguientes:
  - Prioridad alta (`task.priority === 'high'`)
  - Fecha de vencimiento dentro de 24 horas

### Diseño UI

#### Layout

- Header con título "Focus" y contador de tareas
- Lista scrolleable de tareas (FlatList)
- Estado vacío con icono y mensaje motivacional

#### Estilos

- Fondo: `#f8f9fa`
- Tarjetas de tareas: blancas con sombra
- Border radius: 12px
- Padding: 15px
- Iconos: Ionicons

#### Estado Vacío

- Icono: `flash-outline` (64px, color #ccc)
- Título: "All caught up!"
- Subtítulo: "No high priority or due soon tasks"

### Testing

#### Cobertura

- **Líneas:** 90.9%
- **Statements:** 88%
- **Funciones:** 100%
- **Branches:** 62.5%

#### Tests Implementados (26 tests)

- ✅ Renderizado básico (3 tests)
- ✅ Visualización de tareas (4 tests)
- ✅ Estado vacío (2 tests - skipped por limitación técnica)
- ✅ Formato de fechas (4 tests)
- ✅ Funciones helper (3 tests)
- ✅ Lógica de filtrado (3 tests)
- ✅ Estructura de componentes (2 tests)
- ✅ Edge cases (3 tests)
- ✅ Accesibilidad (1 test)

#### Tests Skipped (2)

Dos tests fueron marcados como `it.skip()` debido a una limitación técnica:

- `focusTasks` es una exportación constante que no puede ser mockeada dinámicamente
- No se puede testear el estado vacío sin refactorizar el componente

### Limitaciones Identificadas

1. **Datos estáticos:** Usa `focusTasks` exportado directamente, no permite props
2. **Sin interacción:** Los checkboxes no son funcionales
3. **Sin navegación:** No navega al detalle de la tarea
4. **Sin actualización:** No se actualiza cuando cambian las tareas
5. **Sin personalización:** Criterios de filtrado hardcodeados

### Razones para el Reemplazo

La nueva implementación de Focus (Pomodoro Timer) ofrece:

1. **Funcionalidad activa:** Timer funcional para gestión de tiempo
2. **Técnica Pomodoro:** Intervalos de trabajo y descanso
3. **Tracking de sesiones:** Registro de tiempo invertido
4. **Estadísticas:** Análisis de productividad
5. **Notificaciones:** Alertas al completar intervalos
6. **Configuración:** Personalización de tiempos
7. **Integración profunda:** Vinculación directa con tareas

### Migración de Funcionalidad

La funcionalidad de "tareas importantes" podría ser restaurada en el futuro como:

- Una sección dentro de la nueva pantalla Focus
- Una vista separada (ej: "Priority Tasks")
- Un filtro en TaskListScreen

### Referencias

- **Requisitos nuevos:** `docs/focus-requirements.md`
- **Roadmap:** `docs/focus-roadmap.md`
- **Código original:** `src/screens/FocusScreen.old.tsx`
- **Tests originales:** `__tests__/screens/FocusScreen.old.test.tsx`

---

## Restauración

Si se necesita restaurar la funcionalidad antigua:

1. Renombrar archivos `.old.tsx` eliminando el sufijo
2. Actualizar imports en `App.tsx`
3. Restaurar tests eliminando el sufijo `.old.test.tsx`
4. Ejecutar `pnpm test` para verificar

---

**Documento creado:** 26 de Diciembre, 2025  
**Autor:** Equipo de Desarrollo  
**Estado:** Archivado
