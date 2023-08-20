import {Component, OnInit} from '@angular/core';
import {ListService, PagedResultDto} from "@abp/ng.core";
import {BookService, BookDto, bookTypeOptions} from "@proxy/books";
import {query} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService,
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}
  ],
})
export class BookComponent implements OnInit{
  book = { items: [], totalCount: 0} as PagedResultDto<BookDto>;
  selectedBook = {} as BookDto; //declare selectedBook
  isModalOpen = false; //add Modal

  form: FormGroup; // add form
  bookTypes = bookTypeOptions; // add BookTypes as a list of Booktype in enum
  constructor(
    public readonly list: ListService,
    private bookService: BookService,
    private fb: FormBuilder, // inject FormBuilder
    private confirmation : ConfirmationService) //inject ConfirmationService
  {
  }
  ngOnInit(): void {
    const bookStreamCreator = (query) => this.bookService.getList(query);
    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }

  //Add create Book
  createBook(){
    this.selectedBook = {} as BookDto;
    this.buildForm();
    this.isModalOpen = true;
  }
  //Add method Form
  buildForm(){
    this.form = this.fb.group({
      name: [this.selectedBook.name || '', Validators.required],
      type: [this.selectedBook.type || null, Validators.required],
      publishDate: [
        this.selectedBook.publishDate ? new Date(this.selectedBook.publishDate):
        null, Validators.required
      ],
      price: [this.selectedBook.price  || null, Validators.required],
    });
  }

  //Add update Book
  editBook(id: string){
    this.bookService.get(id).subscribe((book) =>{
      this.selectedBook = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  //Add delete Book
  delete(id: string){
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) =>{
      if(status === Confirmation.Status.confirm){
        this.bookService.delete(id).subscribe(() => this.list.get());
      }
    });
  }




  //Add save Book
  saveBook(){
    if(this.form.valid){
      return;
    }

    const request = this.selectedBook.id
      ? this.bookService.update(this.selectedBook.id, this.form.value)
      : this.bookService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }
}
