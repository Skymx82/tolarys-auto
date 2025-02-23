// Types pour la base de données
export interface DbLesson {
  id: string;
  student_id: string;
  student_name: string;
  type: 'driving' | 'theory';
  start_time: string;
  end_time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  instructor_id: string;
  instructor_name: string;
  location?: string;
  vehicle_id?: string;
  vehicle_name?: string;
  color?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbInstructor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  specialties: ('driving' | 'theory')[];
  working_hours: {
    [key: string]: { // 'monday', 'tuesday', etc.
      start: string;
      end: string;
      break_start?: string;
      break_end?: string;
    };
  };
  vacation_dates: string[];
  color: string;
  created_at: string;
  updated_at: string;
}

export interface DbVehicle {
  id: string;
  name: string;
  type: 'car' | 'motorcycle';
  license_plate: string;
  status: 'available' | 'maintenance' | 'unavailable';
  maintenance_dates: string[];
  color: string;
  created_at: string;
  updated_at: string;
}

export interface DbStudent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  preferred_instructors: string[];
  preferred_vehicles: string[];
  preferred_schedule: {
    [key: string]: { // 'monday', 'tuesday', etc.
      start: string;
      end: string;
    }[];
  };
  created_at: string;
  updated_at: string;
}

// Types pour le calendrier
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: 'driving' | 'theory';
  student: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    name: string;
  };
  vehicle?: {
    id: string;
    name: string;
  };
  location?: string;
  notes?: string;
}

export interface CalendarResource {
  id: string;
  title: string;
  type: 'instructor' | 'vehicle';
  status: string;
  color: string;
}

// Types pour les filtres
export interface PlanningFilters {
  date: Date;
  view: 'day' | 'week' | 'month';
  instructors: string[];
  vehicles: string[];
  lessonTypes: ('driving' | 'theory')[];
  status: ('confirmed' | 'pending' | 'cancelled')[];
}

// Types pour les statistiques
export interface PlanningStats {
  total_lessons: number;
  confirmed_lessons: number;
  pending_lessons: number;
  cancelled_lessons: number;
  driving_lessons: number;
  theory_lessons: number;
  instructor_hours: {
    [key: string]: number; // instructor_id: hours
  };
  vehicle_hours: {
    [key: string]: number; // vehicle_id: hours
  };
}