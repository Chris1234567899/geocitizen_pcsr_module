export class PostLabel {
  id: string;
  channel_id: string;
  label: string;
  label_alias: string;
  slug: string;
  description: string
  description_alias: string
  translations: {
    id: number,
    label: string
    description: string,
    locale: string
    post_label_id: string
  }[]
  color: string;

  created_at: string


  pivot: any
  constructor(
    $id: string,
    $channel_id: string,
    $label: string,
    $description: string,
    $color: string,

  ) {

    this.id = $id;
    this.channel_id = $channel_id;
    this.label = $label;
    this.description = $description;
    this.color = $color;

  }

}
