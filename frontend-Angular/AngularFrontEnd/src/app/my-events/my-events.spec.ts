import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MyEventsComponent } from './my-events';
import { EventService } from '../services/event.service';

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    // Creamos un mock (simulación) del servicio
    mockEventService = jasmine.createSpyObj('EventService', ['getEvents']);
    
    // Datos simulados para las pruebas
    const mockEvents = [
      { eventName: 'Evento A', eventStatus: 'Borrador' },
      { eventName: 'Evento B', eventStatus: 'Rechazado' },
      { eventName: 'Evento C', eventStatus: 'Aprobado' }
    ];

    // Hacemos que getEvents() devuelva esos datos
    mockEventService.getEvents.and.returnValue(of(mockEvents));

    await TestBed.configureTestingModule({
      declarations: [MyEventsComponent],
      providers: [
        { provide: EventService, useValue: mockEventService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ejecuta ngOnInit()
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los eventos al inicializar', () => {
    expect(mockEventService.getEvents).toHaveBeenCalled();
    expect(component.events.length).toBe(3);
  });

  it('debería clasificar los eventos por estado', () => {
    component.filterEventsByStatus();

    expect(component.draftEvents.length).toBe(1);
    expect(component.rejectedEvents.length).toBe(1);
    expect(component.approvedEvents.length).toBe(1);

    expect(component.draftEvents[0].eventName).toBe('Evento A');
    expect(component.rejectedEvents[0].eventName).toBe('Evento B');
    expect(component.approvedEvents[0].eventName).toBe('Evento C');
  });
});
