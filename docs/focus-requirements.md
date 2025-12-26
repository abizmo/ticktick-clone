# Requisitos Funcionales - Pantalla Focus

## Documento de Especificación Funcional
**Versión:** 1.0  
**Fecha:** 26 de Diciembre, 2025  
**Propósito:** Definir los requisitos funcionales para implementar una pantalla de Focus basada en la funcionalidad de TickTick

---

## Índice

1. [Introducción](#introducción)
2. [Alcance](#alcance)
3. [Requisitos Funcionales](#requisitos-funcionales)
4. [Modelo de Datos](#modelo-de-datos)
5. [Arquitectura Técnica](#arquitectura-técnica)

---

## Introducción

La pantalla Focus es una funcionalidad diseñada para ayudar a los usuarios a concentrarse en sus tareas mediante técnicas de gestión del tiempo como Pomodoro y cronómetros. El sistema debe registrar sesiones de concentración, proporcionar estadísticas y ofrecer herramientas para minimizar distracciones.

---

## Alcance

Este documento cubre las funcionalidades core de la pantalla Focus, excluyendo integraciones específicas de plataformas móviles (iOS/Android) como widgets nativos, Live Activities, o integraciones con servicios de salud específicos del sistema operativo.

---

## Requisitos Funcionales

### 1. Configuración y Activación

#### RF-001: Habilitar/Deshabilitar Focus
- **Descripción:** El sistema debe permitir al usuario activar o desactivar la funcionalidad Focus desde la configuración de la aplicación.
- **Criterios de aceptación:**
  - Existe una opción en Configuración > Funcionalidades > Focus
  - Al activarse, aparece en la navegación principal de la aplicación
  - Al desactivarse, se oculta de la navegación pero se conservan los datos históricos
- **Prioridad:** Alta

---

### 2. Modos de Temporizador

#### RF-002: Modo Pomodoro (Cuenta regresiva)
- **Descripción:** Implementar la técnica Pomodoro con intervalos de trabajo y descanso configurables.
- **Funcionalidades:**
  - Configurar duración del intervalo de trabajo (por defecto 25 minutos)
  - Configurar duración del descanso corto (por defecto 5 minutos)
  - Configurar duración del descanso largo (por defecto 15 minutos)
  - Configurar número de pomodoros antes del descanso largo (por defecto 4)
  - Botones: Iniciar, Pausar, Reanudar, Detener
  - Limitar las pausas a máximo 3 por sesión de trabajo
  - Transición automática de trabajo → descanso → trabajo
  - Contador visual de pomodoros completados en la sesión actual
- **Criterios de aceptación:**
  - El temporizador cuenta regresivamente desde el tiempo configurado
  - Al llegar a 00:00, se emite una alerta (sonora/visual)
  - Si se alcanza el límite de 3 pausas, el botón de pausa se deshabilita
  - Al completar el intervalo, se registra en el historial
  - Si el usuario detiene antes de tiempo, se marca como "incompleto"
- **Prioridad:** Alta

#### RF-003: Modo Stopwatch (Cronómetro ascendente)
- **Descripción:** Cronómetro que cuenta hacia adelante sin intervalos predefinidos.
- **Funcionalidades:**
  - Iniciar desde 00:00:00
  - Contar de forma ascendente (horas:minutos:segundos)
  - Pausar/Reanudar sin límite de veces
  - Detener manualmente cuando el usuario lo decida
  - No tiene transiciones automáticas
- **Criterios de aceptación:**
  - El cronómetro muestra el formato HH:MM:SS
  - Permite pausas ilimitadas
  - Al detener, se registra el tiempo total transcurrido
  - No emite alertas automáticas (solo al detener manualmente)
- **Prioridad:** Alta

#### RF-004: Alternancia entre modos
- **Descripción:** Permitir al usuario cambiar entre Modo Pomodoro y Stopwatch.
- **Funcionalidades:**
  - Botón/Toggle para cambiar entre modos
  - Al cambiar, mantener la tarea seleccionada
  - Al cambiar durante una sesión activa, solicitar confirmación
  - Preservar el tiempo acumulado total del día
- **Criterios de aceptación:**
  - El cambio de modo es instantáneo (si no hay sesión activa)
  - Si hay sesión activa, muestra diálogo de confirmación: "¿Deseas detener la sesión actual y cambiar de modo?"
  - La tarea seleccionada se mantiene tras el cambio
  - Las estadísticas totales del día no se ven afectadas
- **Prioridad:** Media

---

### 3. Selección y Gestión de Tareas

#### RF-005: Seleccionar tarea para Focus
- **Descripción:** Permitir al usuario seleccionar una tarea en la que concentrarse.
- **Funcionalidades:**
  - Selector de tareas en el centro de la pantalla Focus
  - Buscador de tareas por nombre
  - Filtrar tareas por proyecto/lista
  - Mostrar solo tareas no completadas
  - Opción "Sin tarea" para sesiones de Focus genéricas
- **Criterios de aceptación:**
  - El selector muestra todas las tareas activas del usuario
  - La búsqueda filtra en tiempo real
  - La tarea seleccionada se muestra de forma destacada
  - Se puede cambiar la tarea durante una sesión activa
- **Prioridad:** Alta

#### RF-006: Iniciar Focus desde una tarea
- **Descripción:** Permitir iniciar una sesión de Focus directamente desde el detalle de una tarea.
- **Funcionalidades:**
  - Botón "Iniciar Focus" en el menú contextual de la tarea
  - Pre-seleccionar la tarea al abrir la pantalla Focus
  - Opción de elegir modo (Pomodoro/Stopwatch) antes de iniciar
- **Criterios de aceptación:**
  - Al hacer clic en "Iniciar Focus" desde una tarea, se abre la pantalla Focus
  - La tarea queda pre-seleccionada
  - El usuario puede cambiar de tarea antes de iniciar si lo desea
- **Prioridad:** Media

#### RF-007: Lista de tareas favoritas para Focus
- **Descripción:** Lista de acceso rápido a tareas frecuentes para iniciar Focus.
- **Funcionalidades:**
  - Añadir/Eliminar tareas de la lista de favoritos
  - Reordenar tareas favoritas (drag & drop)
  - Límite máximo de 10 tareas favoritas
  - Iniciar Focus con un solo clic desde un favorito
- **Criterios de aceptación:**
  - La lista se muestra en la parte superior de la pantalla Focus
  - Al hacer clic en un favorito, inicia Focus inmediatamente con esa tarea
  - Persiste entre sesiones
  - Sincroniza entre dispositivos
- **Prioridad:** Baja

---

### 4. Interfaz de Usuario

#### RF-008: Modo Pantalla Completa
- **Descripción:** Modo inmersivo que oculta elementos innecesarios durante el Focus.
- **Funcionalidades:**
  - Activación manual: tocar el área central de la pantalla
  - Activación automática: opcional, con delay configurable (0-30 segundos)
  - Mostrar solo: temporizador grande, nombre de tarea, controles básicos
  - Tocar pantalla para mostrar/ocultar controles
  - Salir de pantalla completa: botón "X" o gesto
- **Criterios de aceptación:**
  - En modo pantalla completa, el temporizador ocupa al menos el 50% de la pantalla
  - Los controles aparecen/desaparecen con un toque
  - La configuración de auto-activación se respeta
  - Se puede salir del modo pantalla completa en cualquier momento
- **Prioridad:** Media

#### RF-009: Estilos visuales del temporizador
- **Descripción:** Diferentes estilos de visualización del temporizador.
- **Opciones:**
  - Estilo Moderno: números grandes, minimalista
  - Estilo Reloj Analógico: representación circular del tiempo
  - Estilo Pixel/Retro: estética de reloj digital antiguo
  - Cambio de estilo mediante gesto de deslizar o selector
- **Criterios de aceptación:**
  - Al menos 2 estilos visuales disponibles
  - El cambio de estilo no interrumpe la sesión
  - La preferencia se guarda para futuras sesiones
- **Prioridad:** Baja

#### RF-010: Ventana flotante (Desktop)
- **Descripción:** En versiones de escritorio, permitir mostrar el temporizador como ventana flotante.
- **Funcionalidades:**
  - Botón "Abrir en ventana flotante"
  - Ventana siempre visible sobre otras aplicaciones
  - Tamaño ajustable
  - Controles mínimos: Pausar/Reanudar, Detener
  - Hacer clic para volver a la ventana principal
- **Criterios de aceptación:**
  - La ventana flotante permanece visible aunque se cambien de aplicación
  - Los controles básicos funcionan desde la ventana flotante
  - Se puede cerrar la ventana flotante sin detener el Focus
- **Prioridad:** Media (solo desktop)

---

### 5. Sonidos Ambiente (White Noise)

#### RF-011: Reproducción de sonidos ambientales
- **Descripción:** Ofrecer sonidos de fondo para mejorar la concentración.
- **Funcionalidades:**
  - Biblioteca de sonidos: Reloj, Lluvia, Tormenta, Bosque, Café, Océano, Viento, Fuego
  - Algunos sonidos gratuitos (mínimo 3)
  - Otros requieren suscripción premium
  - Controles: Play/Pause, Control de volumen
  - El sonido continúa durante toda la sesión
  - Opción de silencio (sin sonido)
- **Criterios de aceptación:**
  - Los sonidos se reproducen en loop continuo
  - El volumen se controla independientemente del volumen del sistema
  - Al pausar el Focus, también se pausa el sonido
  - Al cambiar de sonido, la transición es suave (fade in/out)
- **Prioridad:** Media

#### RF-012: Gestión de sonidos
- **Descripción:** Configuración y personalización de sonidos ambientales.
- **Funcionalidades:**
  - Seleccionar sonido antes de iniciar Focus
  - Cambiar sonido durante la sesión activa
  - Guardar sonido predeterminado en configuración
  - Preview de sonidos (escuchar 10 segundos antes de seleccionar)
- **Criterios de aceptación:**
  - El sonido predeterminado se aplica automáticamente al iniciar Focus
  - Se puede previsualizar cualquier sonido sin interrumpir la sesión
  - Los cambios de sonido no reinician el temporizador
- **Prioridad:** Baja

---

### 6. Estadísticas y Tracking

#### RF-013: Registro de sesiones
- **Descripción:** Guardar cada sesión de Focus para análisis posterior.
- **Datos a registrar:**
  - ID único de sesión
  - Fecha y hora de inicio
  - Fecha y hora de fin
  - Duración total (en segundos)
  - Tarea asociada (si existe)
  - Modo utilizado (Pomodoro/Stopwatch)
  - Estado: Completada / Interrumpida
  - Número de pausas realizadas
  - Sonido ambiental utilizado (opcional)
- **Criterios de aceptación:**
  - Toda sesión de más de 1 minuto se registra
  - Sesiones Pomodoro completadas se marcan como "Completada"
  - Sesiones detenidas antes de tiempo se marcan como "Interrumpida"
  - Los datos persisten y se sincronizan entre dispositivos
- **Prioridad:** Alta

#### RF-014: Visualización de estadísticas
- **Descripción:** Panel de estadísticas para analizar patrones de concentración.
- **Métricas a mostrar:**
  - **Vista Diaria:**
    - Total de horas de concentración hoy
    - Número de Pomodoros completados hoy
    - Número de sesiones de Stopwatch hoy
    - Tareas en las que se trabajó hoy
  - **Vista Semanal:**
    - Total de horas por día (gráfico de barras)
    - Promedio diario de concentración
    - Mejor día de la semana
    - Distribución de Focus por día
  - **Vista Total:**
    - Total de horas acumuladas históricamente
    - Total de Pomodoros completados
    - Racha actual (días consecutivos con Focus)
    - Racha más larga
  - **Análisis de patrones:**
    - Horas del día con más concentración
    - Tareas con más tiempo invertido
    - Tasa de finalización (sesiones completadas vs interrumpidas)
- **Criterios de aceptación:**
  - Las estadísticas se actualizan en tiempo real al finalizar cada sesión
  - Los gráficos son interactivos (hacer clic para ver detalles)
  - Se puede filtrar por rango de fechas personalizado
  - Opción de exportar estadísticas (CSV/PDF)
- **Prioridad:** Media

#### RF-015: Objetivos y metas
- **Descripción:** Permitir al usuario establecer objetivos de concentración.
- **Funcionalidades:**
  - Establecer objetivo diario de Pomodoros (ej: 8 pomodoros/día)
  - Establecer objetivo diario de horas (ej: 4 horas/día)
  - Mostrar progreso hacia el objetivo del día
  - Notificación al alcanzar el objetivo
  - Histórico de cumplimiento de objetivos
- **Criterios de aceptación:**
  - El progreso se muestra visualmente (barra o porcentaje)
  - Al cumplir el objetivo, se muestra mensaje de felicitación
  - Se puede modificar el objetivo en cualquier momento
  - El histórico muestra % de días en que se cumplió el objetivo
- **Prioridad:** Baja

---

### 7. Notificaciones y Alertas

#### RF-016: Notificaciones de finalización
- **Descripción:** Alertas para indicar el fin de intervalos.
- **Tipos de notificaciones:**
  - Fin de intervalo de trabajo (Pomodoro)
  - Fin de intervalo de descanso (Pomodoro)
  - Recordatorio de objetivo diario (opcional)
- **Configuraciones:**
  - Tipo de alerta: Sonido / Vibración / Ambos / Silencio
  - Sonido de notificación personalizable
  - Volumen de notificación independiente
  - Repetir notificación si no se atiende (1-3 veces)
- **Criterios de aceptación:**
  - Las notificaciones se emiten en el momento exacto de finalización
  - Si la app está en segundo plano, la notificación sigue funcionando
  - El usuario puede descartar la notificación manualmente
  - La configuración de notificaciones se respeta
- **Prioridad:** Alta

---

### 8. Configuración Personalizable

#### RF-017: Ajustes de Pomodoro
- **Descripción:** Personalizar los parámetros de la técnica Pomodoro.
- **Parámetros configurables:**
  - Duración del intervalo de trabajo (5-60 minutos, default: 25)
  - Duración del descanso corto (1-30 minutos, default: 5)
  - Duración del descanso largo (5-60 minutos, default: 15)
  - Número de pomodoros antes de descanso largo (2-8, default: 4)
  - Máximo de pausas permitidas por sesión (0-5, default: 3)
- **Criterios de aceptación:**
  - Los valores se validan (mínimo/máximo)
  - Los cambios se aplican a partir de la siguiente sesión
  - Se muestran ejemplos o tooltips para ayudar al usuario
  - Botón "Restaurar valores por defecto"
- **Prioridad:** Media

#### RF-018: Ajustes generales de Focus
- **Descripción:** Configuraciones adicionales del sistema Focus.
- **Parámetros:**
  - Auto-acceso a pantalla completa (sí/no)
  - Delay para pantalla completa (0-30 segundos)
  - Sonido ambiental por defecto
  - Mantener pantalla encendida durante Focus (sí/no)
  - Activar modo "No Molestar" al iniciar Focus (sí/no)
  - Pregunta de confirmación al detener sesión (sí/no)
- **Criterios de aceptación:**
  - Cada configuración tiene una descripción clara
  - Los cambios se guardan automáticamente
  - Sincronización de configuración entre dispositivos
- **Prioridad:** Media

---

### 9. Integración con Tareas

#### RF-019: Marcar tarea como completada
- **Descripción:** Al finalizar Focus, opción de marcar la tarea como completada.
- **Funcionalidades:**
  - Diálogo al finalizar: "¿Deseas marcar la tarea como completada?"
  - Opciones: Sí / No / Preguntar después
  - Registrar tiempo invertido en la tarea
  - Actualizar progreso de la tarea (si es parcial)
- **Criterios de aceptación:**
  - El diálogo aparece solo si hay una tarea asociada
  - Si se marca como completada, la tarea cambia de estado
  - El tiempo se añade a los metadatos de la tarea
  - Se puede configurar para no preguntar (completar automáticamente o nunca)
- **Prioridad:** Media

#### RF-020: Historial de Focus por tarea
- **Descripción:** Ver todas las sesiones de Focus realizadas para una tarea específica.
- **Funcionalidades:**
  - En el detalle de la tarea, sección "Historial de Focus"
  - Lista de sesiones: fecha, duración, modo
  - Total de tiempo acumulado en esta tarea
  - Gráfico de distribución de sesiones
- **Criterios de aceptación:**
  - Las sesiones se ordenan de más reciente a más antigua
  - Se puede hacer clic en una sesión para ver detalles
  - El tiempo total se actualiza en tiempo real
- **Prioridad:** Baja

---

### 10. Sincronización Multiplataforma

#### RF-021: Sincronización de datos
- **Descripción:** Mantener consistencia entre dispositivos.
- **Datos a sincronizar:**
  - Sesiones de Focus (todas)
  - Configuración de Pomodoro
  - Configuración general de Focus
  - Objetivos establecidos
  - Tareas favoritas para Focus
  - Preferencias de sonidos
- **Criterios de aceptación:**
  - La sincronización ocurre automáticamente al conectarse a internet
  - Resolución de conflictos: última escritura gana
  - Indicador visual de sincronización en progreso
  - Opción de sincronizar manualmente
- **Prioridad:** Alta

#### RF-022: Continuidad entre dispositivos
- **Descripción:** Permitir continuar una sesión iniciada en otro dispositivo.
- **Funcionalidades:**
  - Detectar sesión activa en otro dispositivo
  - Opción de "Continuar en este dispositivo"
  - Sincronizar tiempo transcurrido en tiempo real
  - Alertar si se intenta iniciar Focus simultáneamente en dos dispositivos
- **Criterios de aceptación:**
  - Solo puede haber una sesión activa a la vez por usuario
  - Al abrir la app, se muestra mensaje si hay sesión activa en otro dispositivo
  - La continuación transfiere el estado completo (tiempo, tarea, modo, etc.)
- **Prioridad:** Baja

---

## Modelo de Datos

### Tabla: `focus_sessions`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único de sesión | PRIMARY KEY |
| user_id | UUID | ID del usuario | NOT NULL, FOREIGN KEY |
| task_id | UUID | ID de la tarea asociada | NULLABLE, FOREIGN KEY |
| mode | ENUM | Modo utilizado: 'pomodoro', 'stopwatch' | NOT NULL |
| start_time | TIMESTAMP | Fecha y hora de inicio | NOT NULL |
| end_time | TIMESTAMP | Fecha y hora de fin | NULLABLE |
| duration_seconds | INTEGER | Duración total en segundos | NOT NULL, >= 0 |
| pauses_count | INTEGER | Número de pausas realizadas | DEFAULT 0, >= 0 |
| status | ENUM | Estado: 'completed', 'interrupted', 'active' | NOT NULL |
| white_noise_used | VARCHAR(50) | Sonido ambiental utilizado | NULLABLE |
| created_at | TIMESTAMP | Fecha de creación del registro | DEFAULT NOW() |
| updated_at | TIMESTAMP | Última actualización | DEFAULT NOW() |

**Índices:**
- `idx_user_sessions` en (`user_id`, `start_time`)
- `idx_task_sessions` en (`task_id`, `start_time`)
- `idx_status` en (`status`)

---

### Tabla: `focus_settings`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| user_id | UUID | ID del usuario | PRIMARY KEY, FOREIGN KEY |
| pomo_work_duration | INTEGER | Minutos de trabajo | DEFAULT 25, BETWEEN 5 AND 60 |
| pomo_short_break | INTEGER | Minutos de descanso corto | DEFAULT 5, BETWEEN 1 AND 30 |
| pomo_long_break | INTEGER | Minutos de descanso largo | DEFAULT 15, BETWEEN 5 AND 60 |
| pomos_before_long_break | INTEGER | Pomodoros antes de descanso largo | DEFAULT 4, BETWEEN 2 AND 8 |
| max_pauses_per_session | INTEGER | Pausas máximas permitidas | DEFAULT 3, BETWEEN 0 AND 5 |
| daily_pomo_goal | INTEGER | Objetivo diario de pomodoros | DEFAULT 8, >= 0 |
| daily_hours_goal | DECIMAL(4,2) | Objetivo diario de horas | DEFAULT 4.0, >= 0 |
| auto_fullscreen | BOOLEAN | Auto-activar pantalla completa | DEFAULT FALSE |
| auto_fullscreen_delay | INTEGER | Segundos de delay | DEFAULT 5, BETWEEN 0 AND 30 |
| default_white_noise | VARCHAR(50) | Sonido por defecto | NULLABLE |
| keep_screen_on | BOOLEAN | Mantener pantalla encendida | DEFAULT TRUE |
| enable_dnd | BOOLEAN | Activar No Molestar | DEFAULT FALSE |
| confirm_stop | BOOLEAN | Confirmar al detener | DEFAULT TRUE |
| auto_complete_task | BOOLEAN | Auto-completar tarea al finalizar | DEFAULT FALSE |
| notification_sound | VARCHAR(50) | Sonido de notificación | DEFAULT 'bell' |
| notification_type | ENUM | Tipo: 'sound', 'vibration', 'both', 'silent' | DEFAULT 'both' |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Última actualización | DEFAULT NOW() |

---

### Tabla: `focus_favorites`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PRIMARY KEY |
| user_id | UUID | ID del usuario | NOT NULL, FOREIGN KEY |
| task_id | UUID | ID de la tarea | NOT NULL, FOREIGN KEY |
| order_position | INTEGER | Posición en la lista | NOT NULL, >= 1 |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |

**Índices:**
- `idx_user_favorites` en (`user_id`, `order_position`)
- `unique_user_task` UNIQUE en (`user_id`, `task_id`)

---

### Tabla: `focus_goals_history`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PRIMARY KEY |
| user_id | UUID | ID del usuario | NOT NULL, FOREIGN KEY |
| date | DATE | Fecha del objetivo | NOT NULL |
| pomo_goal | INTEGER | Objetivo de pomodoros | NOT NULL |
| pomo_achieved | INTEGER | Pomodoros logrados | DEFAULT 0 |
| hours_goal | DECIMAL(4,2) | Objetivo de horas | NOT NULL |
| hours_achieved | DECIMAL(4,2) | Horas logradas | DEFAULT 0.0 |
| goal_met | BOOLEAN | Objetivo cumplido | DEFAULT FALSE |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |

**Índices:**
- `idx_user_date` UNIQUE en (`user_id`, `date`)

---

## Arquitectura Técnica

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   FocusView  │  │  StatsView   │  │ SettingsView │  │
│  │              │  │              │  │              │  │
│  │ - Timer      │  │ - Charts     │  │ - Config     │  │
│  │ - Controls   │  │ - Metrics    │  │ - Prefs      │  │
│  │ - TaskPicker │  │ - History    │  │ - Goals      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
└─────────┼─────────────────┼──────────────────┼──────────┘
          │                 │                  │
┌─────────┼─────────────────┼──────────────────┼──────────┐
│         ▼                 ▼                  ▼          │
│                  STATE MANAGEMENT                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │            FocusStore (Zustand/Redux)          │     │
│  │                                                 │     │
│  │  - currentSession: Session | null              │     │
│  │  - mode: 'pomodoro' | 'stopwatch'              │     │
│  │  - timerState: 'idle' | 'running' | 'paused'   │     │
│  │  - elapsedTime: number                         │     │
│  │  - selectedTask: Task | null                   │     │
│  │  - settings: FocusSettings                     │     │
│  │  - statistics: FocusStats                      │     │
│  │                                                 │     │
│  │  Actions:                                       │     │
│  │  - startFocus()                                 │     │
│  │  - pauseFocus()                                 │     │
│  │  - resumeFocus()                                │     │
│  │  - stopFocus()                                  │     │
│  │  - switchMode()                                 │     │
│  │  - selectTask()                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────┐
│                          ▼                               │
│                   SERVICE LAYER                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  TimerService    │  │ SessionService   │             │
│  │                  │  │                  │             │
│  │ - tick()         │  │ - create()       │             │
│  │ - pause()        │  │ - update()       │             │
│  │ - resume()       │  │ - complete()     │             │
│  │ - reset()        │  │ - interrupt()    │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ WhiteNoisePlayer │  │ NotificationMgr  │             │
│  │                  │  │                  │             │
│  │ - play()         │  │ - schedule()     │             │
│  │ - pause()        │  │ - send()         │             │
│  │ - setVolume()    │  │ - clear()        │             │
│  │ - loadSound()    │  │                  │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  StatsService    │  │   SyncService    │             │
│  │                  │  │                  │             │
│  │ - calculate()    │  │ - syncUp()       │             │
│  │ - aggregate()    │  │ - syncDown()     │             │
│  │ - exportData()   │  │ - resolveConf()  │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────┐
│                          ▼                               │
│                    DATA LAYER                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API Client / Repository              │   │
│  │                                                    │   │
│  │  FocusRepository:                                  │   │
│  │  - getSessions(filters)                            │   │
│  │  - createSession(data)                             │   │
│  │  - updateSession(id, data)                         │   │
│  │  - getSettings(userId)                             │   │
│  │  - updateSettings(userId, data)                    │   │
│  │  - getStatistics(userId, dateRange)                │   │
│  │  - getFavorites(userId)                            │   │
│  │  - addFavorite(userId, taskId)                     │   │
│  │  - removeFavorite(userId, taskId)                  │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │             Local Storage / Cache                 │   │
│  │                                                    │   │
│  │  - Active session state (persistence)             │   │
│  │  - User preferences (offline access)              │   │
│  │  - Recent sessions (quick access)                 │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Flujos Principales

#### 1. Iniciar sesión de Focus (Pomodoro)

```
Usuario hace clic en "Iniciar"
    ↓
FocusView → FocusStore.startFocus()
    ↓
FocusStore:
  - Valida que no haya sesión activa
  - Crea nueva sesión (SessionService.create())
  - Inicia temporizador (TimerService.tick())
  - Inicia sonido ambiental (WhiteNoisePlayer.play())
  - Actualiza estado: timerState = 'running'
    ↓
TimerService:
  - setInterval(1000ms)
  - Cada segundo: decrementa tiempo
  - Actualiza FocusStore.elapsedTime
    ↓
Al llegar a 00:00:
  - TimerService emite evento 'completed'
  - NotificationMgr.send('Intervalo completado')
  - SessionService.update(session, {status: 'completed'})
  - FocusStore inicia intervalo de descanso
```

#### 2. Pausar sesión

```
Usuario hace clic en "Pausar"
    ↓
FocusView → FocusStore.pauseFocus()
    ↓
FocusStore:
  - Incrementa pausesCount
  - Valida si pausesCount <= maxPauses
  - Si válido:
      - TimerService.pause()
      - WhiteNoisePlayer.pause()
      - SessionService.update(session, {pauses_count: pausesCount})
      - Actualiza estado: timerState = 'paused'
  - Si inválido:
      - Muestra mensaje: "Límite de pausas alcanzado"
```

#### 3. Detener sesión

```
Usuario hace clic en "Detener"
    ↓
Si confirm_stop = true:
  - Muestra diálogo de confirmación
  - Usuario confirma → continúa
    ↓
FocusView → FocusStore.stopFocus()
    ↓
FocusStore:
  - TimerService.reset()
  - WhiteNoisePlayer.pause()
  - SessionService.complete(session, {
      end_time: now(),
      status: elapsedTime >= targetTime ? 'completed' : 'interrupted'
    })
  - Si hay tarea asociada y auto_complete_task = true:
      - TaskService.complete(task)
  - Si hay tarea asociada y auto_complete_task = false:
      - Muestra diálogo: "¿Marcar tarea como completada?"
  - Actualiza estadísticas (StatsService.calculate())
  - Sincroniza (SyncService.syncUp())
  - Resetea estado: timerState = 'idle'
```

#### 4. Sincronización de sesión activa entre dispositivos

```
Dispositivo A:
  - Usuario inicia Focus
  - SessionService.create() → API: POST /sessions
  - SyncService.syncUp() marca sesión como 'active'
    ↓
Servidor:
  - Guarda sesión con status='active'
  - Emite evento WebSocket: 'session_started'
    ↓
Dispositivo B:
  - SyncService recibe WebSocket: 'session_started'
  - Muestra notificación: "Sesión activa en otro dispositivo"
  - Opción: "Continuar aquí"
    ↓
Si usuario elige "Continuar aquí":
  - SyncService.syncDown() obtiene sesión activa
  - FocusStore.restoreSession(session)
  - TimerService.setTime(session.elapsedTime)
  - WhiteNoisePlayer.play(session.white_noise)
  - Dispositivo A recibe evento: 'session_transferred'
  - Dispositivo A detiene su temporizador local
```

---

### Tecnologías Sugeridas

#### Frontend
- **Framework:** React / Vue / Svelte
- **State Management:** Zustand / Redux / Pinia
- **UI Components:** shadcn/ui / MUI / Ant Design
- **Gráficos:** Recharts / Chart.js / D3.js
- **Audio:** Howler.js / Web Audio API

#### Backend
- **API:** Node.js (Express) / Python (FastAPI) / Go (Gin)
- **Base de Datos:** PostgreSQL / MongoDB
- **Real-time:** WebSockets (Socket.io) / Server-Sent Events
- **Cache:** Redis
- **Autenticación:** JWT / OAuth2

#### Sincronización
- **Protocolo:** WebSockets para tiempo real
- **Backup:** Polling cada 30 segundos
- **Resolución de conflictos:** Last-write-wins (timestamp)

---

## Priorización de Desarrollo

### Fase 1: MVP (Funcionalidad Básica)
- ✅ RF-001: Activación de Focus
- ✅ RF-002: Modo Pomodoro básico
- ✅ RF-005: Selección de tarea
- ✅ RF-013: Registro de sesiones
- ✅ RF-016: Notificaciones básicas
- ✅ RF-017: Configuración de Pomodoro

**Tiempo estimado:** 2-3 semanas

### Fase 2: Funcionalidad Extendida
- ✅ RF-003: Modo Stopwatch
- ✅ RF-004: Alternancia entre modos
- ✅ RF-011: Sonidos ambientales
- ✅ RF-014: Estadísticas básicas
- ✅ RF-019: Completar tarea al finalizar
- ✅ RF-021: Sincronización básica

**Tiempo estimado:** 3-4 semanas

### Fase 3: Mejoras UX
- ✅ RF-008: Modo pantalla completa
- ✅ RF-009: Estilos visuales
- ✅ RF-012: Gestión de sonidos
- ✅ RF-015: Objetivos y metas
- ✅ RF-018: Configuración avanzada

**Tiempo estimado:** 2-3 semanas

### Fase 4: Características Avanzadas
- ✅ RF-007: Tareas favoritas
- ✅ RF-010: Ventana flotante (desktop)
- ✅ RF-020: Historial por tarea
- ✅ RF-022: Continuidad entre dispositivos

**Tiempo estimado:** 2-3 semanas

---

## Consideraciones Técnicas

### Rendimiento
- El temporizador debe usar `requestAnimationFrame` o Web Workers para evitar inconsistencias
- Los sonidos deben pre-cargarse en memoria para evitar delays al iniciar
- Las estadísticas deben calcularse de forma lazy (solo cuando se visualizan)

### Accesibilidad
- Atajos de teclado para todas las acciones principales
- Soporte para lectores de pantalla
- Modo de alto contraste
- Tamaños de fuente ajustables

### Seguridad
- Las sesiones activas deben expirar después de 24 horas de inactividad
- Validación de límites en todos los inputs del usuario
- Sanitización de datos antes de persistir

### Testing
- **Unit tests:** Lógica de temporizador, cálculos de estadísticas
- **Integration tests:** Flujos de inicio/pausa/detener
- **E2E tests:** Flujo completo de usuario
- **Performance tests:** Sincronización con múltiples dispositivos

---

## Glosario

- **Pomodoro:** Intervalo de trabajo de 25 minutos seguido de un descanso corto
- **Sesión:** Período continuo de Focus desde inicio hasta detención
- **Intervalo:** Cada bloque de tiempo dentro de una sesión Pomodoro (trabajo o descanso)
- **White Noise:** Sonidos ambientales utilizados para mejorar la concentración
- **Racha (Streak):** Días consecutivos con al menos una sesión de Focus completada

---

## Anexos

### A. Mockups sugeridos
(Aquí puedes añadir wireframes o mockups de las pantallas principales)

### B. Casos de uso detallados
(Documentación extendida de flujos específicos)

### C. API Endpoints
(Especificación detallada de la API RESTful)

---

**Fin del documento**
