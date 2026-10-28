import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, defaultPostValues } from '../schemas/postSchema';

function PostForm({ initialValues, onSubmit, isEdit = false }) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: initialValues || defaultPostValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      if (err && err.field && err.message) {
        setError(err.field, { message: err.message, type: 'server' });
      } else {
        setError('root.serverError', {
          message: err.message || 'Произошла ошибка при сохранении',
        });
      }
    }
  };

  const isButtonDisabled = !isValid || isSubmitting || (isEdit && !isDirty);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {errors.root?.serverError && (
        <div className="error-text" style={{ marginBottom: 16, padding: 10, background: '#fee2e2', borderRadius: 6 }}>
          {errors.root.serverError.message}
        </div>
      )}

      <div>
        <label>Заголовок</label>
        <input {...register('title')} placeholder="Введите заголовок (от 3 символов)" />
        {errors.title && <p className="error-text">{errors.title.message}</p>}
      </div>

      <div>
        <label>Содержимое</label>
        <textarea {...register('body')} rows={4} placeholder="Текст поста (от 10 символов)" />
        {errors.body && <p className="error-text">{errors.body.message}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>ID автора (userId)</label>
          <input type="number" {...register('userId')} />
          {errors.userId && <p className="error-text">{errors.userId.message}</p>}
        </div>

        <div>
          <label>Статус</label>
          <select {...register('status')}>
            <option value="draft">Черновик</option>
            <option value="published">Опубликован</option>
          </select>
          {errors.status && <p className="error-text">{errors.status.message}</p>}
        </div>
      </div>

      <div>
        <label>Дата публикации</label>
        <input type="date" {...register('publishDate')} />
        {errors.publishDate && <p className="error-text">{errors.publishDate.message}</p>}
      </div>

      <div style={{ margin: '20px 0' }}>
        <label>Теги (от 1 до 5)</label>
        {fields.map((field, index) => (
          <div key={field.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input {...register(`tags.${index}`)} placeholder={`Тег #${index + 1}`} />
            <button
              type="button"
              className="btn-danger"
              onClick={() => remove(index)}
              style={{ padding: '10px 14px' }}
            >
              Удалить
            </button>
          </div>
        ))}
        {errors.tags?.root && <p className="error-text">{errors.tags.root.message}</p>}
        {errors.tags && !errors.tags.root && typeof errors.tags.message === 'string' && (
          <p className="error-text">{errors.tags.message}</p>
        )}
        {fields.length < 5 && (
          <button
            type="button"
            onClick={() => append('')}
            style={{ marginTop: 6 }}
          >
            + Добавить тег
          </button>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={isButtonDisabled} style={{ width: '100%', padding: 12 }}>
        {isSubmitting ? 'Сохранение...' : 'Сохранить пост'}
      </button>
    </form>
  );
}

export default PostForm;
