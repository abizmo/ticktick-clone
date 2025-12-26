# 🎯 Focus Feature - Roadmap de Implementación (Fase 1 - MVP)

**Versión:** 1.0  
**Fecha de inicio:** 26 de Diciembre, 2025  
**Objetivo:** Reemplazar la pantalla Focus actual con un sistema completo de Pomodoro Timer

---

## 📊 Resumen Ejecutivo

### Decisiones Clave

- ✅ **Estrategia:** Reemplazar completamente FocusScreen actual
- ✅ **Alcance:** Solo Fase 1 (MVP) del documento de requisitos
- ✅ **Backend:** Híbrido (Mock/AsyncStorage primero, backend después)
- ✅ **Plataforma:** Móvil primero (iOS/Android)
- ✅ **Estado:** Zustand para gestión de estado global

### Métricas de Éxito

- [ ] Temporizador Pomodoro funcional con ciclos trabajo/descanso
- [ ] Selección de tareas integrada con datos existentes
- [ ] Registro de sesiones persistente (AsyncStorage)
- [ ] Notificaciones al completar intervalos
- [ ] Configuración personalizable de tiempos
- [ ] > 80% cobertura de tests en nueva funcionalidad
- [ ] 0 regresiones en funcionalidad existente

---

## 🗂️ Estructura del Proyecto

### Nueva Estructura de Carpetas

```
src/
├── features/
│   └── focus/
│       ├── components/          # Componentes UI de Focus
│       │   ├── Timer.tsx
│       │   ├── TimerControls.tsx
│       │   ├── TaskSelector.tsx
│       │   ├── PomodoroProgress.tsx
│       │   └── SessionHistory.tsx
│       ├── services/            # Lógica de negocio
│       │   ├── timerService.ts
│       │   ├── sessionService.ts
│       │   └── storageService.ts
│       ├── store/               # Estado Zustand
│       │   └── focusStore.ts
│       ├── types/               # Interfaces TypeScript
│       │   └── focus.types.ts
│       ├── utils/               # Utilidades
│       │   ├── timeFormatter.ts
│       │   └── pomodoroCalculator.ts
│       └── screens/             # Pantallas
│           ├── FocusScreen.tsx
│           └── FocusSettingsScreen.tsx
├── screens/                     # Pantallas existentes
│   ├── TaskListScreen.tsx       # (sin cambios)
│   ├── CalendarScreen.tsx       # (sin cambios)
│   └── SettingsScreen.tsx       # (modificar para añadir Focus settings)
└── data/
    └── mockData.ts              # (sin cambios)
```

---

## 📝 Tareas por Fase

### **FASE 0: Preparación y Setup** (2-3 días)

#### 0.1 Instalación de Dependencias

- [x] **0.1.1** Instalar Zustand: `pnpm add zustand`
- [x] **0.1.2** Instalar AsyncStorage: `pnpm add @react-native-async-storage/async-storage`
- [x] **0.1.3** Instalar notificaciones: `pnpm add react-native-push-notification @react-native-community/push-notification-ios`
- [x] **0.1.4** Configurar notificaciones en iOS (Podfile)
- [x] **0.1.5** Configurar notificaciones en Android (AndroidManifest.xml)
- [x] **0.1.6** Actualizar mocks de testing para nuevas dependencias

#### 0.2 Estructura de Carpetas

- [x] **0.2.1** Crear carpeta `src/features/focus/`
- [x] **0.2.2** Crear subcarpetas: components, services, store, types, utils, screens
- [x] **0.2.3** Crear archivo `.gitkeep` en carpetas vacías

#### 0.3 Backup de Código Actual

- [x] **0.3.1** Renombrar `FocusScreen.tsx` a `FocusScreen.old.tsx`
- [x] **0.3.2** Renombrar test `FocusScreen.test.tsx` a `FocusScreen.old.test.tsx`
- [x] **0.3.3** Documentar funcionalidad antigua en `docs/focus-legacy.md`

---

### **FASE 1: Modelo de Datos y Tipos** (1-2 días)

#### 1.1 Interfaces TypeScript

- [x] **1.1.1** Crear `src/features/focus/types/focus.types.ts` - 👤 Coordinador
- [x] **1.1.2** Definir interface `FocusSession` - 👤 Coordinador
  ```typescript
  interface FocusSession {
    id: string;
    userId?: string;
    taskId?: string;
    mode: 'pomodoro' | 'stopwatch';
    startTime: Date;
    endTime?: Date;
    durationSeconds: number;
    pausesCount: number;
    status: 'active' | 'completed' | 'interrupted';
    createdAt: Date;
    updatedAt: Date;
  }
  ```
- [x] **1.1.3** Definir interface `FocusSettings` - 👤 Coordinador
  ```typescript
  interface FocusSettings {
    pomoWorkDuration: number; // minutos
    pomoShortBreak: number; // minutos
    pomoLongBreak: number; // minutos
    pomosBeforeLongBreak: number;
    maxPausesPerSession: number;
    confirmStop: boolean;
  }
  ```
- [x] **1.1.4** Definir interface `TimerState` - 👤 Coordinador
  ```typescript
  interface TimerState {
    mode: 'pomodoro' | 'stopwatch';
    status: 'idle' | 'running' | 'paused';
    currentPhase: 'work' | 'shortBreak' | 'longBreak';
    timeRemaining: number; // segundos
    pomodorosCompleted: number;
    pausesUsed: number;
  }
  ```
- [x] **1.1.5** Definir tipos auxiliares (enums, unions) - 👤 Coordinador

#### 1.2 Valores por Defecto

- [x] **1.2.1** Crear `src/features/focus/constants/defaults.ts` - 👤 Coordinador
- [x] **1.2.2** Definir `DEFAULT_FOCUS_SETTINGS` - 👤 Coordinador
- [x] **1.2.3** Definir `TIMER_INTERVALS` (work: 25min, short: 5min, long: 15min) - 👤 Coordinador
- [x] **1.2.4** Definir `MAX_PAUSES_DEFAULT = 3` - 👤 Coordinador

---

### **FASE 2: Servicios de Almacenamiento** (2 días)

#### 2.1 Storage Service (AsyncStorage)

- [x] **2.1.1** Crear `src/features/focus/services/storageService.ts` - 👤 Coordinador
- [x] **2.1.2** Implementar `saveFocusSettings(settings: FocusSettings): Promise<void>` - 👤 Coordinador
- [x] **2.1.3** Implementar `loadFocusSettings(): Promise<FocusSettings | null>` - 👤 Coordinador
- [x] **2.1.4** Implementar `saveFocusSession(session: FocusSession): Promise<void>` - 👤 Coordinador
- [x] **2.1.5** Implementar `loadFocusSessions(limit?: number): Promise<FocusSession[]>` - 👤 Coordinador
- [x] **2.1.6** Implementar `getTodaySessions(): Promise<FocusSession[]>` - 👤 Coordinador
- [x] **2.1.7** Implementar `clearAllSessions(): Promise<void>` (para testing) - 👤 Coordinador
- [x] **2.1.8** Añadir manejo de errores y logging - 👤 Coordinador

#### 2.2 Session Service

- [x] **2.2.1** Crear `src/features/focus/services/sessionService.ts` - 👤 Coordinador
- [x] **2.2.2** Implementar `createSession(taskId?, mode): FocusSession` - 👤 Coordinador
- [x] **2.2.3** Implementar `updateSession(session, updates): FocusSession` - 👤 Coordinador
- [x] **2.2.4** Implementar `completeSession(session): FocusSession` - 👤 Coordinador
- [x] **2.2.5** Implementar `interruptSession(session): FocusSession` - 👤 Coordinador
- [x] **2.2.6** Implementar `calculateDuration(session): number` - 👤 Coordinador
- [x] **2.2.7** Implementar session validation helpers - 👤 Coordinador
- [x] **2.2.8** Implementar statistics helpers - 👤 Coordinador
- [x] **2.2.9** Añadir JSDoc documentation - 👤 Coordinador

---

### **FASE 3: Timer Service (Lógica del Temporizador)** (2-3 días)

#### 3.1 Timer Core

- [ ] **3.1.1** Crear `src/features/focus/services/timerService.ts`
- [ ] **3.1.2** Implementar clase `TimerService` con EventEmitter
- [ ] **3.1.3** Implementar método `start(durationSeconds: number)`
- [ ] **3.1.4** Implementar método `pause()`
- [ ] **3.1.5** Implementar método `resume()`
- [ ] **3.1.6** Implementar método `stop()`
- [ ] **3.1.7** Implementar método `reset()`
- [ ] **3.1.8** Implementar tick cada segundo (usar `setInterval`)
- [ ] **3.1.9** Emitir eventos: `tick`, `complete`, `pause`, `resume`

#### 3.2 Pomodoro Logic

- [ ] **3.2.1** Crear `src/features/focus/utils/pomodoroCalculator.ts`
- [ ] **3.2.2** Implementar `getNextPhase(current, pomodorosCompleted, settings): Phase`
- [ ] **3.2.3** Implementar `getPhaseDuration(phase, settings): number`
- [ ] **3.2.4** Implementar `shouldTakeLongBreak(pomodorosCompleted, settings): boolean`
- [ ] **3.2.5** Implementar `canPause(pausesUsed, maxPauses): boolean`

#### 3.3 Time Formatting

- [ ] **3.3.1** Crear `src/features/focus/utils/timeFormatter.ts`
- [ ] **3.3.2** Implementar `formatTime(seconds): string` (MM:SS)
- [ ] **3.3.3** Implementar `formatDuration(seconds): string` (Xh Ym)
- [ ] **3.3.4** Implementar `secondsToMinutes(seconds): number`
- [ ] **3.3.5** Implementar `minutesToSeconds(minutes): number`

---

### **FASE 4: Zustand Store** (2 días)

#### 4.1 Focus Store Setup

- [ ] **4.1.1** Crear `src/features/focus/store/focusStore.ts`
- [ ] **4.1.2** Definir estado inicial del store

  ```typescript
  interface FocusStoreState {
    // Timer state
    timerState: TimerState;
    currentSession: FocusSession | null;
    selectedTask: Task | null;

    // Settings
    settings: FocusSettings;

    // History
    sessions: FocusSession[];
    todayStats: {totalMinutes: number; pomodorosCompleted: number};

    // Actions
    startFocus: (taskId?: string) => void;
    pauseFocus: () => void;
    resumeFocus: () => void;
    stopFocus: () => void;
    selectTask: (task: Task | null) => void;
    updateSettings: (settings: Partial<FocusSettings>) => void;
    loadSessions: () => Promise<void>;
  }
  ```

- [ ] **4.1.3** Implementar store con Zustand
- [ ] **4.1.4** Añadir middleware de persistencia (AsyncStorage)

#### 4.2 Store Actions

- [ ] **4.2.1** Implementar `startFocus(taskId?)`
  - Validar que no haya sesión activa
  - Crear nueva sesión
  - Iniciar TimerService
  - Actualizar estado
- [ ] **4.2.2** Implementar `pauseFocus()`
  - Validar límite de pausas
  - Pausar TimerService
  - Incrementar pausesUsed
  - Actualizar sesión
- [ ] **4.2.3** Implementar `resumeFocus()`
  - Reanudar TimerService
  - Actualizar estado
- [ ] **4.2.4** Implementar `stopFocus()`
  - Detener TimerService
  - Completar o interrumpir sesión
  - Guardar en AsyncStorage
  - Resetear estado
- [ ] **4.2.5** Implementar `selectTask(task)`
- [ ] **4.2.6** Implementar `updateSettings(settings)`
- [ ] **4.2.7** Implementar `loadSessions()`
- [ ] **4.2.8** Implementar `calculateTodayStats()`

#### 4.3 Store Listeners

- [ ] **4.3.1** Suscribirse a eventos de TimerService
- [ ] **4.3.2** Manejar evento `tick` → actualizar timeRemaining
- [ ] **4.3.3** Manejar evento `complete` → transición de fase o completar
- [ ] **4.3.4** Manejar evento `pause` → actualizar estado
- [ ] **4.3.5** Manejar evento `resume` → actualizar estado

---

### **FASE 5: Componentes UI** (4-5 días)

#### 5.1 Timer Display Component

- [ ] **5.1.1** Crear `src/features/focus/components/Timer.tsx`
- [ ] **5.1.2** Diseñar layout circular del temporizador
- [ ] **5.1.3** Mostrar tiempo en formato MM:SS (grande, centrado)
- [ ] **5.1.4** Añadir indicador visual de progreso (círculo animado)
- [ ] **5.1.5** Mostrar fase actual (Work / Short Break / Long Break)
- [ ] **5.1.6** Aplicar colores según fase (trabajo: azul, descanso: verde)
- [ ] **5.1.7** Añadir animación de transición entre fases

#### 5.2 Timer Controls Component

- [ ] **5.2.1** Crear `src/features/focus/components/TimerControls.tsx`
- [ ] **5.2.2** Botón "Start" (solo visible cuando idle)
- [ ] **5.2.3** Botón "Pause" (solo visible cuando running)
- [ ] **5.2.4** Botón "Resume" (solo visible cuando paused)
- [ ] **5.2.5** Botón "Stop" (visible cuando running o paused)
- [ ] **5.2.6** Deshabilitar "Pause" si se alcanzó límite de pausas
- [ ] **5.2.7** Mostrar contador de pausas usadas (ej: "2/3 pausas")
- [ ] **5.2.8** Añadir confirmación al hacer clic en "Stop"

#### 5.3 Task Selector Component

- [ ] **5.3.1** Crear `src/features/focus/components/TaskSelector.tsx`
- [ ] **5.3.2** Mostrar tarea seleccionada actual (o "Sin tarea")
- [ ] **5.3.3** Botón para abrir modal de selección
- [ ] **5.3.4** Modal con lista de tareas no completadas
- [ ] **5.3.5** Filtrar tareas de `mockTasks` (completed: false)
- [ ] **5.3.6** Mostrar nombre de tarea, lista, y prioridad
- [ ] **5.3.7** Opción "Sin tarea" al inicio de la lista
- [ ] **5.3.8** Cerrar modal al seleccionar
- [ ] **5.3.9** Deshabilitar cambio de tarea durante sesión activa (opcional)

#### 5.4 Pomodoro Progress Component

- [ ] **5.4.1** Crear `src/features/focus/components/PomodoroProgress.tsx`
- [ ] **5.4.2** Mostrar contador de pomodoros completados hoy
- [ ] **5.4.3** Mostrar indicadores visuales (🍅 x N)
- [ ] **5.4.4** Mostrar próximo descanso (corto/largo)
- [ ] **5.4.5** Diseño minimalista, no invasivo

#### 5.5 Session History Component

- [ ] **5.5.1** Crear `src/features/focus/components/SessionHistory.tsx`
- [ ] **5.5.2** Listar sesiones del día actual
- [ ] **5.5.3** Mostrar: hora, duración, tarea, estado
- [ ] **5.5.4** Iconos diferentes para completada/interrumpida
- [ ] **5.5.5** Mostrar total de minutos del día
- [ ] **5.5.6** Scroll vertical si hay muchas sesiones

---

### **FASE 6: Pantalla Principal de Focus** (2 días)

#### 6.1 FocusScreen Layout

- [ ] **6.1.1** Crear `src/features/focus/screens/FocusScreen.tsx`
- [ ] **6.1.2** Diseñar layout principal:
  - Header con título "Focus"
  - TaskSelector en la parte superior
  - Timer en el centro (componente principal)
  - TimerControls debajo del timer
  - PomodoroProgress debajo de controles
  - SessionHistory en la parte inferior (colapsable)
- [ ] **6.1.3** Conectar con Zustand store
- [ ] **6.1.4** Implementar lógica de inicio/pausa/stop
- [ ] **6.1.5** Manejar transiciones de fase automáticas

#### 6.2 Integración con Store

- [ ] **6.2.1** Usar hooks de Zustand para acceder al estado
- [ ] **6.2.2** Suscribirse a cambios de `timerState`
- [ ] **6.2.3** Suscribirse a cambios de `currentSession`
- [ ] **6.2.4** Cargar sesiones al montar componente
- [ ] **6.2.5** Limpiar listeners al desmontar

#### 6.3 Manejo de Estados

- [ ] **6.3.1** Estado idle: mostrar botón "Start"
- [ ] **6.3.2** Estado running: mostrar timer activo + botón "Pause"
- [ ] **6.3.3** Estado paused: mostrar timer pausado + botón "Resume"
- [ ] **6.3.4** Mostrar mensaje si no hay tarea seleccionada (opcional)

---

### **FASE 7: Pantalla de Configuración** (1-2 días)

#### 7.1 FocusSettingsScreen

- [ ] **7.1.1** Crear `src/features/focus/screens/FocusSettingsScreen.tsx`
- [ ] **7.1.2** Sección "Duración de Intervalos"
  - Input: Trabajo (5-60 min, default: 25)
  - Input: Descanso corto (1-30 min, default: 5)
  - Input: Descanso largo (5-60 min, default: 15)
- [ ] **7.1.3** Sección "Configuración de Pomodoro"
  - Input: Pomodoros antes de descanso largo (2-8, default: 4)
  - Input: Máximo de pausas (0-5, default: 3)
- [ ] **7.1.4** Sección "Preferencias"
  - Toggle: Confirmar al detener sesión (default: true)
- [ ] **7.1.5** Botón "Restaurar valores por defecto"
- [ ] **7.1.6** Validación de rangos en inputs
- [ ] **7.1.7** Guardar cambios automáticamente
- [ ] **7.1.8** Mostrar tooltips/ayuda para cada configuración

#### 7.2 Integración con SettingsScreen Principal

- [ ] **7.2.1** Abrir `src/screens/SettingsScreen.tsx`
- [ ] **7.2.2** Añadir nueva sección "Focus"
- [ ] **7.2.3** Añadir item "Configuración de Pomodoro" que navegue a FocusSettingsScreen
- [ ] **7.2.4** Actualizar navegación para incluir FocusSettingsScreen

---

### **FASE 8: Notificaciones** (1-2 días)

#### 8.1 Notification Service

- [ ] **8.1.1** Crear `src/features/focus/services/notificationService.ts`
- [ ] **8.1.2** Configurar permisos de notificaciones
- [ ] **8.1.3** Implementar `requestPermissions(): Promise<boolean>`
- [ ] **8.1.4** Implementar `scheduleNotification(title, body, delay?)`
- [ ] **8.1.5** Implementar `cancelAllNotifications()`
- [ ] **8.1.6** Implementar `showLocalNotification(title, body)`

#### 8.2 Integración con Focus

- [ ] **8.2.1** Solicitar permisos al iniciar app (primera vez)
- [ ] **8.2.2** Notificación al completar intervalo de trabajo
  - Título: "¡Pomodoro completado!"
  - Cuerpo: "Tiempo de descanso (5 min)"
- [ ] **8.2.3** Notificación al completar descanso
  - Título: "Descanso terminado"
  - Cuerpo: "Listo para el siguiente pomodoro"
- [ ] **8.2.4** Notificación en background (app cerrada)
- [ ] **8.2.5** Sonido personalizado (opcional)
- [ ] **8.2.6** Vibración al notificar

---

### **FASE 9: Integración con Tareas Existentes** (1 día)

#### 9.1 Botón "Iniciar Focus" en TaskListScreen

- [ ] **9.1.1** Abrir `src/screens/TaskListScreen.tsx`
- [ ] **9.1.2** Añadir botón/icono "Iniciar Focus" en cada TaskItem
- [ ] **9.1.3** Al hacer clic, navegar a FocusScreen con tarea pre-seleccionada
- [ ] **9.1.4** Pasar `taskId` como parámetro de navegación

#### 9.2 Pre-selección de Tarea

- [ ] **9.2.1** En FocusScreen, leer parámetro `taskId` de navegación
- [ ] **9.2.2** Si existe `taskId`, buscar tarea en `mockTasks`
- [ ] **9.2.3** Llamar a `selectTask(task)` automáticamente
- [ ] **9.2.4** Mostrar tarea pre-seleccionada en TaskSelector

---

### **FASE 10: Testing** (3-4 días)

#### 10.1 Unit Tests - Services

- [ ] **10.1.1** Crear `__tests__/features/focus/services/timerService.test.ts`
- [ ] **10.1.2** Test: `start()` inicia el temporizador
- [ ] **10.1.3** Test: `pause()` pausa correctamente
- [ ] **10.1.4** Test: `resume()` reanuda desde tiempo pausado
- [ ] **10.1.5** Test: `stop()` detiene y resetea
- [ ] **10.1.6** Test: emite evento `tick` cada segundo
- [ ] **10.1.7** Test: emite evento `complete` al llegar a 0

- [ ] **10.1.8** Crear `__tests__/features/focus/services/sessionService.test.ts`
- [ ] **10.1.9** Test: `createSession()` genera sesión válida
- [ ] **10.1.10** Test: `completeSession()` marca como completada
- [ ] **10.1.11** Test: `interruptSession()` marca como interrumpida
- [ ] **10.1.12** Test: `calculateDuration()` calcula correctamente

- [ ] **10.1.13** Crear `__tests__/features/focus/services/storageService.test.ts`
- [ ] **10.1.14** Test: `saveFocusSettings()` guarda en AsyncStorage
- [ ] **10.1.15** Test: `loadFocusSettings()` carga correctamente
- [ ] **10.1.16** Test: `saveFocusSession()` persiste sesión
- [ ] **10.1.17** Test: `getTodaySessions()` filtra por fecha

#### 10.2 Unit Tests - Utils

- [ ] **10.2.1** Crear `__tests__/features/focus/utils/pomodoroCalculator.test.ts`
- [ ] **10.2.2** Test: `getNextPhase()` calcula siguiente fase
- [ ] **10.2.3** Test: `shouldTakeLongBreak()` detecta descanso largo
- [ ] **10.2.4** Test: `canPause()` valida límite de pausas

- [ ] **10.2.5** Crear `__tests__/features/focus/utils/timeFormatter.test.ts`
- [ ] **10.2.6** Test: `formatTime(90)` retorna "01:30"
- [ ] **10.2.7** Test: `formatDuration(3665)` retorna "1h 1m"

#### 10.3 Integration Tests - Store

- [ ] **10.3.1** Crear `__tests__/features/focus/store/focusStore.test.ts`
- [ ] **10.3.2** Test: `startFocus()` crea sesión y arranca timer
- [ ] **10.3.3** Test: `pauseFocus()` incrementa pausesUsed
- [ ] **10.3.4** Test: `pauseFocus()` falla si se alcanzó límite
- [ ] **10.3.5** Test: `stopFocus()` guarda sesión en AsyncStorage
- [ ] **10.3.6** Test: transición automática de trabajo a descanso
- [ ] **10.3.7** Test: `loadSessions()` carga desde AsyncStorage

#### 10.4 Component Tests

- [ ] **10.4.1** Crear `__tests__/features/focus/components/Timer.test.tsx`
- [ ] **10.4.2** Test: renderiza tiempo correctamente
- [ ] **10.4.3** Test: muestra fase actual (Work/Break)
- [ ] **10.4.4** Test: aplica colores según fase

- [ ] **10.4.5** Crear `__tests__/features/focus/components/TimerControls.test.tsx`
- [ ] **10.4.6** Test: muestra botón "Start" cuando idle
- [ ] **10.4.7** Test: muestra botón "Pause" cuando running
- [ ] **10.4.8** Test: deshabilita "Pause" si se alcanzó límite
- [ ] **10.4.9** Test: llama a `startFocus()` al hacer clic en Start

- [ ] **10.4.10** Crear `__tests__/features/focus/components/TaskSelector.test.tsx`
- [ ] **10.4.11** Test: muestra tarea seleccionada
- [ ] **10.4.12** Test: abre modal al hacer clic
- [ ] **10.4.13** Test: filtra tareas completadas
- [ ] **10.4.14** Test: selecciona tarea y cierra modal

#### 10.5 Screen Tests

- [ ] **10.5.1** Crear `__tests__/features/focus/screens/FocusScreen.test.tsx`
- [ ] **10.5.2** Test: renderiza sin errores
- [ ] **10.5.3** Test: muestra todos los componentes principales
- [ ] **10.5.4** Test: inicia sesión al hacer clic en Start
- [ ] **10.5.5** Test: pausa sesión correctamente
- [ ] **10.5.6** Test: detiene sesión con confirmación
- [ ] **10.5.7** Test: carga sesiones al montar

- [ ] **10.5.8** Crear `__tests__/features/focus/screens/FocusSettingsScreen.test.tsx`
- [ ] **10.5.9** Test: renderiza todos los inputs
- [ ] **10.5.10** Test: valida rangos de inputs
- [ ] **10.5.11** Test: guarda cambios en store
- [ ] **10.5.12** Test: restaura valores por defecto

#### 10.6 Integration Tests - E2E Flow

- [ ] **10.6.1** Crear `__tests__/features/focus/integration/focusFlow.test.tsx`
- [ ] **10.6.2** Test: flujo completo de pomodoro (inicio → pausa → resume → completar)
- [ ] **10.6.3** Test: transición automática trabajo → descanso
- [ ] **10.6.4** Test: completar 4 pomodoros → descanso largo
- [ ] **10.6.5** Test: detener sesión antes de tiempo → marca como interrumpida
- [ ] **10.6.6** Test: iniciar Focus desde TaskListScreen

#### 10.7 Coverage y Calidad

- [ ] **10.7.1** Ejecutar `pnpm test:coverage`
- [ ] **10.7.2** Verificar >80% cobertura en features/focus
- [ ] **10.7.3** Corregir tests fallidos
- [ ] **10.7.4** Ejecutar `pnpm run lint` y corregir errores

---

### **FASE 11: Documentación** (1-2 días)

#### 11.1 Documentación Técnica

- [ ] **11.1.1** Crear `docs/focus-architecture.md`
- [ ] **11.1.2** Documentar estructura de carpetas
- [ ] **11.1.3** Documentar flujo de datos (Store → Services → UI)
- [ ] **11.1.4** Documentar interfaces principales
- [ ] **11.1.5** Añadir diagramas de flujo (opcional)

#### 11.2 Documentación de Usuario

- [ ] **11.2.1** Crear `docs/focus-user-guide.md`
- [ ] **11.2.2** Explicar qué es la técnica Pomodoro
- [ ] **11.2.3** Guía de uso paso a paso
- [ ] **11.2.4** Explicar configuraciones disponibles
- [ ] **11.2.5** FAQ y troubleshooting

#### 11.3 Actualizar README

- [ ] **11.3.1** Añadir sección "Focus Feature" en README.md
- [ ] **11.3.2** Actualizar screenshots (cuando estén disponibles)
- [ ] **11.3.3** Actualizar lista de features
- [ ] **11.3.4** Añadir badges si aplica

#### 11.4 Changelog

- [ ] **11.4.1** Crear `CHANGELOG.md` si no existe
- [ ] **11.4.2** Documentar cambios de esta versión
- [ ] **11.4.3** Marcar como breaking change (reemplazo de FocusScreen)

---

### **FASE 12: Refinamiento y Pulido** (2-3 días)

#### 12.1 UX/UI Polish

- [ ] **12.1.1** Revisar diseño con usuario/stakeholder
- [ ] **12.1.2** Ajustar colores y tipografía
- [ ] **12.1.3** Añadir animaciones suaves (transiciones)
- [ ] **12.1.4** Mejorar feedback visual (botones, estados)
- [ ] **12.1.5** Optimizar para diferentes tamaños de pantalla
- [ ] **12.1.6** Probar en dispositivos reales (iOS y Android)

#### 12.2 Performance

- [ ] **12.2.1** Optimizar re-renders (React.memo, useMemo)
- [ ] **12.2.2** Verificar que timer no cause lag
- [ ] **12.2.3** Optimizar carga de sesiones (lazy loading)
- [ ] **12.2.4** Reducir tamaño de bundle si es necesario

#### 12.3 Accesibilidad

- [ ] **12.3.1** Añadir labels de accesibilidad a botones
- [ ] **12.3.2** Asegurar contraste de colores (WCAG AA)
- [ ] **12.3.3** Probar con lector de pantalla
- [ ] **12.3.4** Añadir hints para inputs

#### 12.4 Error Handling

- [ ] **12.4.1** Manejar errores de AsyncStorage
- [ ] **12.4.2** Manejar errores de notificaciones
- [ ] **12.4.3** Mostrar mensajes de error amigables
- [ ] **12.4.4** Añadir logging para debugging

#### 12.5 Edge Cases

- [ ] **12.5.1** Probar con app en background
- [ ] **12.5.2** Probar con app cerrada (notificaciones)
- [ ] **12.5.3** Probar con cambio de fecha (medianoche)
- [ ] **12.5.4** Probar con batería baja
- [ ] **12.5.5** Probar con modo avión
- [ ] **12.5.6** Probar con múltiples pausas/resumes rápidos

---

### **FASE 13: Preparación para Backend (Futuro)** (1 día)

#### 13.1 Abstracción de Datos

- [ ] **13.1.1** Crear interface `FocusRepository`
- [ ] **13.1.2** Implementar `LocalFocusRepository` (AsyncStorage actual)
- [ ] **13.1.3** Preparar estructura para `RemoteFocusRepository` (futuro)
- [ ] **13.1.4** Documentar endpoints necesarios para backend

#### 13.2 Sincronización (Preparación)

- [ ] **13.2.1** Añadir campo `synced: boolean` a FocusSession
- [ ] **13.2.2** Añadir campo `lastSyncedAt: Date` a settings
- [ ] **13.2.3** Documentar estrategia de sincronización futura

---

## 📊 Métricas de Progreso

### Resumen de Tareas

- **Total de tareas:** 200+
- **Completadas:** 18
- **En progreso:** 0
- **Pendientes:** 182+

### Progreso por Fase

- [x] Fase 0: Preparación (9/9 tareas) ✅ **COMPLETADA** - 👤 Coordinador
- [x] Fase 1: Modelo de Datos (9/9 tareas) ✅ **COMPLETADA** - 👤 Coordinador
- [ ] Fase 2: Almacenamiento (0/8 tareas)
- [ ] Fase 3: Timer Service (0/14 tareas)
- [ ] Fase 4: Zustand Store (0/13 tareas)
- [ ] Fase 5: Componentes UI (0/30 tareas)
- [ ] Fase 6: Pantalla Focus (0/11 tareas)
- [ ] Fase 7: Configuración (0/10 tareas)
- [ ] Fase 8: Notificaciones (0/12 tareas)
- [ ] Fase 9: Integración Tareas (0/4 tareas)
- [ ] Fase 10: Testing (0/50 tareas)
- [ ] Fase 11: Documentación (0/11 tareas)
- [ ] Fase 12: Refinamiento (0/20 tareas)
- [ ] Fase 13: Preparación Backend (0/6 tareas)

### Estimación de Tiempo

- **Tiempo estimado total:** 18-24 días de desarrollo
- **Tiempo transcurrido:** 1 día
- **Tiempo restante:** 17-23 días

---

## 🎯 Próximos Pasos Inmediatos

1. ✅ Revisar y aprobar este roadmap
2. ✅ Fase 0: Preparación y Setup (COMPLETADA)
3. ✅ Fase 1: Modelo de Datos y Tipos (COMPLETADA)
4. ⏭️ Comenzar Fase 2: Servicios de Almacenamiento

---

## 📝 Notas y Decisiones

### Decisiones Técnicas

- **Zustand** elegido por simplicidad y rendimiento
- **AsyncStorage** para MVP, backend en Fase 2
- **react-native-push-notification** para notificaciones locales
- **No usar** Context API para evitar re-renders innecesarios

### Riesgos Identificados

- ⚠️ Notificaciones en background pueden ser complejas en iOS
- ⚠️ Timer puede perder precisión si app está en background
- ⚠️ AsyncStorage tiene límite de 6MB (suficiente para MVP)

### Dependencias Externas

- Requiere permisos de notificaciones (usuario debe aceptar)
- Requiere configuración nativa (iOS Podfile, Android Manifest)

---

## 🔄 Historial de Cambios

| Fecha      | Versión | Cambios                        |
| ---------- | ------- | ------------------------------ |
| 2025-12-26 | 1.0     | Creación inicial del roadmap   |
| 2025-12-26 | 1.1     | Fase 0 completada (9/9 tareas) |
| 2025-12-26 | 1.2     | Fase 1 completada (9/9 tareas) |

---

**Última actualización:** 26 de Diciembre, 2025  
**Responsable:** Equipo de Desarrollo  
**Estado:** 🟢 En progreso - Fases 0 y 1 completadas
