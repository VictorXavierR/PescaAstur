import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { WeatherService } from '../service/weather.service';
import { MarineService } from '../service/marine.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private waypointMarker: L.Marker | undefined;
  weather: any;
  marineWeather: any;
  lineChartData: any;
  lineChartOptions: any;
  lineChartMarineData: any;
  lineChartMarineOptions: any;

  constructor(private wheatherService: WeatherService, private cdr: ChangeDetectorRef, private marineService: MarineService) {
    this.weather = {}; // Inicializa weather como objeto vacío
    this.marineWeather = {}; // Inicializa marineWeather como objeto vacío
    this.lineChartData = {
      labels: [],
      datasets: []
    };

    this.lineChartMarineData = {
      labels: [],
      datasets: []
    };

    this.lineChartMarineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          waveHeight: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Wave Height (m)'
            }
          },
          waveHeightMax: {
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Wave Height Max (m)',
            },
            grid: {
              drawOnChartArea: false // only want the grid lines for one axis
            }
          }
        }
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy'
          },
          zoom: {
            wheel: {
              enabled: true
            },
            pinch: {
              enabled: true
            },
            mode: 'xy'
          }
        }
      }
    
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          temperaturePrecipitationWindSpeed: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Value'
            }
          },
          windDirection: {
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Wind Direction (°)'
            },
            grid: {
              drawOnChartArea: false // only want the grid lines for one axis
            }
          }
        }
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy'
          },
          zoom: {
            wheel: {
              enabled: true
            },
            pinch: {
              enabled: true
            },
            mode: 'xy'
          }
        }
      }
    };
  }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([43.3619, -5.8494], 10); // Latitud y longitud de Asturias, España

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
      detectRetina: true,
      crossOrigin: true
    }).addTo(this.map);

    // Marcador por defecto y generación de las gráficas
    this.createDefaultMarker(43.3619, -5.8494);

    this.map.on('click', (e: any) => {
      this.handleMapClick(e.latlng.lat, e.latlng.lng);
      this.getWeather(e.latlng.lat, e.latlng.lng);
      this.getMarineWeather(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  private getWeather(lat: number, lon: number): void {
    this.weather = {}; // Limpiar datos existentes
    this.lineChartData = {
      labels: [],
      datasets: []
    };
    this.wheatherService.getWeather(lat.toString(), lon.toString()).subscribe((data: any) => {
      this.weather = data;
      console.log('Weather data:', this.weather);

      // Limpiar datos existentes
      this.lineChartData.labels = [];
      this.lineChartData.datasets = [];

      if (this.weather && this.weather.hourly && this.weather.hourly.time.length > 0) {
        // Filtrar datos para obtener solo los del día de hoy
        const today = new Date();
        const todayDateString = today.toISOString().split('T')[0];

        const filteredTimes = this.weather.hourly.time.filter((time: string) =>
          time.startsWith(todayDateString)
        );

        const startIndex = this.weather.hourly.time.indexOf(filteredTimes[0]);
        const endIndex = startIndex + filteredTimes.length;

        const filteredTemperature = this.weather.hourly.temperature_2m.slice(startIndex, endIndex);
        const filteredPrecipitation = this.weather.hourly.precipitation_probability.slice(startIndex, endIndex);
        const filteredWindSpeed = this.weather.hourly.wind_speed_10m.slice(startIndex, endIndex);
        const filteredWindDirection = this.weather.hourly.wind_direction_10m.slice(startIndex, endIndex);

        // Asignar etiquetas (tiempo)
        this.lineChartData.labels = filteredTimes;

        // Asignar nuevos datasets
        this.lineChartData.datasets = [
          {
            label: 'Temperature (°C)',
            data: filteredTemperature,
            borderColor: '#3cba9f',
            fill: false,
            yAxisID: 'temperaturePrecipitationWindSpeed'
          },
          {
            label: 'Precipitation Probability (%)',
            data: filteredPrecipitation,
            borderColor: '#ffcc00',
            fill: false,
            yAxisID: 'temperaturePrecipitationWindSpeed'
          },
          {
            label: 'Wind Speed (m/s)',
            data: filteredWindSpeed,
            borderColor: '#ff6600',
            fill: false,
            yAxisID: 'temperaturePrecipitationWindSpeed'
          },
          {
            label: 'Wind Direction (°)',
            data: filteredWindDirection,
            borderColor: '#0066ff',
            fill: false,
            yAxisID: 'windDirection'
          }
        ];

        // Asegurar que el gráfico se actualice visualmente
        this.cdr.detectChanges();
      }

    },
  
  
    (error: any) => {
      console.error('Error fetching weather data:', error);
    });
  }

  private getMarineWeather(lat: number, lon: number): void {
    this.marineWeather = {}; // Limpiar datos existentes
    this.lineChartMarineData = {
      labels: [],
      datasets: []
    };
    this.marineService.getMarineWeather(lat.toString(), lon.toString()).subscribe({
      next: (data: any) => {
        this.marineWeather = data;
        console.log('Marine weather data:', this.marineWeather);
  
        // Limpiar datos existentes
        this.lineChartMarineData.labels = [];
        this.lineChartMarineData.datasets = [];
  
        if (this.marineWeather && this.marineWeather.hourly && this.marineWeather.hourly.time.length > 0) {
          // Filtrar datos para obtener solo los del día de hoy
          const today = new Date();
          const todayDateString = today.toISOString().split('T')[0];
  
          const filteredTimes = this.marineWeather.hourly.time.filter((time: string) => 
            time.startsWith(todayDateString)
          );
          const filteredTimesDaily= this.marineWeather.daily.time.filter((time: string) => 
            time.startsWith(todayDateString)
          );
  
          if (filteredTimes.length > 0 && filteredTimesDaily.length > 0) {
            const startIndex = this.marineWeather.hourly.time.indexOf(filteredTimes[0]);
            const endIndex = startIndex + filteredTimes.length;
            const startIndexDaily = this.marineWeather.daily.time.indexOf(filteredTimesDaily[0]);
            const endIndexDaily = startIndexDaily + filteredTimesDaily.length;
  
            const filteredWaveHeight = this.marineWeather.hourly.wave_height.slice(startIndex, endIndex);
            const filteredWaveHeightMax = this.marineWeather.daily.wave_height_max.slice(startIndexDaily, endIndexDaily);
            const filteredWaveDirectionDominant = this.marineWeather.daily.wave_direction_dominant.slice(startIndexDaily, endIndexDaily);
            const filteredWavePeriodMax = this.marineWeather.daily.wave_period_max.slice(startIndexDaily, endIndexDaily);
  
            // Asignar etiquetas (tiempo)
            this.lineChartMarineData.labels = filteredTimes;
  
            // Asignar nuevos datasets
            this.lineChartMarineData.datasets = [
              {
                label: 'Wave Height (m)',
                data: filteredWaveHeight,
                borderColor: '#3cba9f',
                fill: false,
                yAxisID: 'waveHeight'
              },
              {
                label: 'Wave Height Max (m)',
                data: filteredWaveHeightMax,
                borderColor: '#ffcc00',
                fill: false,
                yAxisID: 'waveHeightMax'
              },
              {
                label: 'Wave Direction Dominant (°)',
                data: filteredWaveDirectionDominant,
                borderColor: '#ff6600',
                fill: false,
                yAxisID: 'waveDirectionDominant'
              },
              {
                label: 'Wave Period Max (s)',
                data: filteredWavePeriodMax,
                borderColor: '#0066ff',
                fill: false,
                yAxisID: 'wavePeriodMax'
              }
            ];
            // Asegurar que el gráfico se actualice visualmente
            this.cdr.detectChanges();
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching weather data:', error);
      }
    });
  }

  private handleMapClick(lat: number, lng: number): void {
    // Eliminar el marcador existente si existe
    if (this.waypointMarker) {
      this.map.removeLayer(this.waypointMarker);
    }

    const waypointIcon = L.divIcon({
      className: 'waypoint-icon', // Clase CSS personalizada para el icono
      html: '<i class="fas fa-map-marker fa-2x"></i>', // HTML del icono de Font Awesome
      iconSize: [32, 32], // Tamaño del icono [ancho, alto]
      iconAnchor: [16, 32], // Punto de anclaje del icono [posición horizontal, posición vertical]
      popupAnchor: [0, -32] // Punto de anclaje del popup del icono [posición horizontal, posición vertical]
    });

    // Crear un nuevo marcador en las coordenadas donde se hizo clic
    this.waypointMarker = L.marker([lat, lng], { icon: waypointIcon }).addTo(this.map);
  }

  // Método para crear un marcador por defecto y generar gráficas
private createDefaultMarker(lat: number, lng: number): void {
  const waypointIcon = L.divIcon({
    className: 'waypoint-icon', // Clase CSS personalizada para el icono
    html: '<i class="fas fa-map-marker fa-2x"></i>', // HTML del icono de Font Awesome
    iconSize: [32, 32], // Tamaño del icono [ancho, alto]
    iconAnchor: [16, 32], // Punto de anclaje del icono [posición horizontal, posición vertical]
    popupAnchor: [0, -32] // Punto de anclaje del popup del icono [posición horizontal, posición vertical]
  });

  // Crear el marcador en las coordenadas por defecto
  this.waypointMarker = L.marker([lat, lng], { icon: waypointIcon }).addTo(this.map);

  // Generar las gráficas para el marcador por defecto
  this.getWeather(lat, lng);
  this.getMarineWeather(lat, lng);
}

}
