import {Component, OnInit} from '@angular/core';
import {ListService, PagedResultDto} from "@abp/ng.core";
import {BookService,BookDto} from "@proxy/books";
import {query} from "@angular/animations";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService],
})
export class BookComponent implements OnInit{
  book = { items: [], totalCount: 0} as PagedResultDto<BookDto>;

  constructor(public readonly list: ListService, private bookService: BookService)
  {
  }
  ngOnInit(): void {
    const bookStreamCreator = (query) => this.bookService.getList(query);
    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }
}
