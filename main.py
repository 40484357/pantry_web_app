from webapp import create_app
from flask import render_template, redirect, url_for, request
from flask_login import login_user, login_required, current_user
from webapp import db
from webapp.models import food_items, shopping_list, favourite_recipes
from datetime import date, datetime
import json

app = create_app()

@app.route('/delete/<int:item>')
def delete(item):
    item_to_delete = shopping_list.query.get_or_404(item)
    
    db.session.delete(item_to_delete)
    db.session.commit()

    return redirect(url_for('views.shopping'))

@app.route('/data_after_post/<int:id>', methods=['GET', 'POST'])
def data_after_post(id):
    
    item_to_delete = shopping_list.query.get_or_404(id)
    db.session.delete(item_to_delete)
    db.session.commit()
    print(id)
    return redirect(url_for('views.shopping'))

@app.route('/update_pantry', methods=['GET', 'POST'])
def update_pantry():
    if request.method == "POST":
        id = request.form.get('food_title')
        print(id)
        amount = request.form.get('amount')
        expiry = request.form.get('expiry')
        item_to_update = food_items.query.get_or_404(id)
        item_to_update.amount = amount
        item_to_update.expiry = expiry
        db.session.commit()
        return redirect(url_for('views.pantry'))
    
@app.route('/delete_pantry/<int:id>', methods=['GET', 'POST'])
def delete_pantry(id):
    item_to_delete = food_items.query.get_or_404(id)
    db.session.delete(item_to_delete)
    db.session.commit()
    return redirect(url_for('views.pantry'))


@app.route('/favourite_recipe/<int:id>', methods=['GET', 'POST'])
def favourite_recipe(id):
    item_to_add = id
    new_item = favourite_recipes(recipe_id = item_to_add, user_id=current_user.id)
    db.session.add(new_item)
    db.session.commit()
    return 'success', 200

if __name__ == '__main__':
    app.run(debug=True)

    