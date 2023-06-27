export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface Result {
  formatted_address: string;
  geometry: {
    location: Location;
    viewport: Viewport;
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  place_id: string;
  plus_code: PlusCode;
  reference: string;
  types: string[];
}

export interface PlaceResult {
  html_attributions: any[];
  results: Result[];
  status: string;
}