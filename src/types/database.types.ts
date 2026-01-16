export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          image_url: string | null
        }
      }
      sub_categories: {
        Row: {
          id: string
          created_at: string
          name: string
          category_id: string
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          title: string
          sub_category_id: string | null
          description: string | null
          price: number
          discount_percent: number | null
          inventory: number
          images: string[] | null
        }
      }
      company_settings: {
        Row: {
          id: number
          site_name: string
          hero_title: string | null
          hero_subtitle: string | null
          hero_image_url: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
        }
      }
    }
  }
}