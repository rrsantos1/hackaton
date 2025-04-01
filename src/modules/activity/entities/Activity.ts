import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
  
export enum ActivityType {
    QUIZ = "quiz",
    WORD_SEARCH = "word_search",
    CROSSWORD = "crossword",
    CLOZE = "cloze",
    MATCHING = "matching",
    MULTIPLE_CHOICE = "multiple_choice",
    FILL_IN_THE_BLANK = "fill_in_the_blank",
    DRAG_DROP = "drag_drop",
    SORTING = "sorting",
    SURVEY = "survey",    
}
  
@Entity({ name: "activities" })
export class Activity {
    @PrimaryGeneratedColumn("increment", {
        name: "id"})
    id?: number;
    
    @Column({ 
        name: "title",
        type: "varchar", 
        length: 255 
    })
    title!: string;
    
    @Column({ 
        name: "description",
        type: "text", 
        nullable: true 
    })
    description?: string;
    
    @Column({ 
        name: "category",
        type: "varchar", 
        length: 100 
    })
    category!: string;
    
    @Column({ 
        name: "type",
        type: "enum", 
        enum: ActivityType 
    })
    type!: ActivityType;
    
    // Configurações específicas da atividade (ex.: tempo, número de tentativas, etc.)
    @Column({ 
        name: "config",
        type: "json", 
        nullable: true 
    })
    config?: any;
    
    // Dados customizados da atividade (pode ser usado para armazenar, por exemplo, perguntas de um quiz)
    @Column({
        name: "content", 
        type: "json", 
        nullable: true 
    })
    content?: any;

    @Column({
        name: "cover_image",
        type: "varchar",
        length: 255,
        nullable: true,  // torna o campo opcional
    })
    coverImage?: string;
    
    @CreateDateColumn({ 
        name: "createdAt",
        type: "timestamptz" 
    })
    createdAt?: Date;
    
    @UpdateDateColumn({
        name: "updatedAt", 
        type: "timestamptz" 
    })
    updatedAt?: Date;
}  