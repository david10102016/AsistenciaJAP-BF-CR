# 📱 Sistema de Asistencia Escolar con Firebase - Juana Azurduy-Buena fe-Campo Rosso

Este proyecto es una **aplicación web progresiva (PWA)** desarrollada para el control de asistencia de estudiantes en la unidad educativa *Juana Azurduy,Buen afe, Campo Rosso*, con compatibilidad multiplataforma (navegador, Android y Windows).

## ✅ Características

- Registro de asistencias por día y curso.
- Consulta de estadísticas y faltas acumuladas.
- Funciona **100% en línea**, no requiere servidor local.
- Puede **instalarse como aplicación** desde el navegador (en PC o móvil Android).
- Optimizado para **Firebase Hosting y Firebase Firestore**.

## 🌐 Instalación desde el navegador

1. Abre la aplicación en tu navegador:  
   `https://asistencia-colegio.web.app`
   `https://registro-asistencias-907a9.web.app`

2. Haz clic en el icono de instalación del navegador:  
   - En **Chrome móvil**: 3 puntos > “Agregar a pantalla principal”.  
   - En **Chrome escritorio**: verás un ícono de instalación a la derecha de la barra de direcciones.

3. La aplicación se instalará como si fuera una app nativa.

> ⚠️ **Importante:** No es necesario descargar un APK. La instalación es directa desde el navegador.

## 🔥 Dependencias y tecnología

| Tecnología | Descripción |
|------------|-------------|
| Firebase Hosting | Alojamiento del frontend. |
| Firebase Firestore | Base de datos no relacional en tiempo real. |
| HTML5 / CSS3 / JS | Estructura base de la aplicación. |
| PWA | Compatible con dispositivos Android y escritorio. |

## 🔧 Estructura de la base de datos

La base de datos utilizada es **Firebase Firestore**, por lo tanto es:

- **No relacional** (NoSQL).
- Basada en **colecciones y documentos**.
- Optimizada para lectura/escritura en tiempo real.
- No requiere configuraciones complejas de relaciones.

### Ejemplo de estructura:
asistencias/
└── cursoA/
└── 2025-08-01/
└── estudianteID123: { nombre: "Juan Pérez", presente: true }


## ⚙️ Consideraciones técnicas

- No se recomienda usar esta app en **modo local (localhost)**, ya que Firebase no funcionará correctamente si no está desplegado.
- No requiere instalación de servidores como XAMPP o bases de datos MySQL.

## 📂 Créditos y licencias

Desarrollado por: **Juan David Uscamayta Ramos**  
Para: U.E. Juana Azurduy - Buena fe - Campo Rosso -Proyecto de asistencia técnica educativa.

Licencia: MIT

---


