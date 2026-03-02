# Angular интеграция

⚠️ **Angular обертка находится в разработке**

Angular интеграция планируется в будущих релизах. Пока что используйте нативное API.

## Ожидаемая структура

```typescript
import { Component } from '@angular/core';
import { StoryCarousel } from '@storykit/angular';

@Component({
  selector: 'app-stories',
  template: `
    <story-carousel
      [stories]="stories"
      [autoPlay]="true"
      (storyEnd)="onStoryEnd($event)"
      (complete)="onComplete()"
    >
      <ng-template #storyTemplate let-story="story" let-progress="progress">
        <div class="custom-story">
          <h2>{{ story.content }}</h2>
          <div class="progress-bar" [style.width.%]="progress * 100"></div>
        </div>
      </ng-template>
    </story-carousel>
  `,
})
export class StoriesComponent {
  stories = [
    { id: '1', content: 'История 1', duration: 3000 },
    { id: '2', content: 'История 2', duration: 4000 },
  ];

  onStoryEnd(story: any) {
    console.log('История завершена:', story);
  }

  onComplete() {
    console.log('Все истории просмотрены');
  }
}
```

## Временное решение

```typescript
import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { StoryCarousel } from '@storykit/core';

@Component({
  selector: 'app-stories',
  template: '<div #container></div>',
})
export class StoriesComponent implements OnDestroy {
  @ViewChild('container') container!: ElementRef;

  private carousel?: StoryCarousel;

  ngAfterViewInit() {
    this.carousel = new StoryCarousel({
      stories: this.stories,
      // ... конфигурация
    });
  }

  ngOnDestroy() {
    this.carousel?.destroy();
  }
}
```

---

[← Svelte интеграция](svelte-integration.md) | [→ Vanilla JS](vanilla-js.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/vanilla-js.md
