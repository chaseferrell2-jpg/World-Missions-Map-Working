import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { Topology } from 'topojson-specification';

// A specific type for country features, adding properties like name.
export interface CountryProperties {
  name: string;
  peopleGroupCount: number | null;
  christianPercentage: number | null;
  unreachedPercentage: number | null;
  mainReligion: string | null;
  prayerIdeas: string | null;
  christianChallenges: string | null;
  missionsText: string | null;
  supportLink: string | null;
}

export type CountryFeature = Feature<Geometry, CountryProperties>;

export type CountryFeatureCollection = FeatureCollection<Geometry, CountryProperties>;

// Type for the world atlas topology from the CDN
export interface WorldAtlasTopology extends Topology {
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: Array<{
        type: "Polygon" | "MultiPolygon";
        id: string;
        properties: { name: string };
        arcs: any;
      }>;
    };
    land: {
      type: "GeometryCollection";
      geometries: any[];
    };
  };
}