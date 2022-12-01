from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_user, login_required, current_user
from . import db
from .models import food_items, shopping_list, User, favourite_recipes
from datetime import date, datetime


views = Blueprint('views', __name__)

@views.route('/')
def landing():
    t = True
    
    if hasattr(current_user, "id") == t:
       return redirect(url_for('views.home'))
    else:
       return render_template('landing.html')

@views.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    d1 = db.session.query(food_items.expiry).filter_by(user_id = current_user.id).order_by(food_items.expiry).all()
    timeDiffArray = []    
    for dates in d1:
        newdate = dates
        d = newdate[0]
        t = datetime.strptime(d, '%Y-%m-%d')
        t2 = datetime.now()
        delta = t - t2
        days = delta.days
        timeDiff = str(days)
        timeDiffArray.append(timeDiff)
        print(newdate)
    
    return render_template("home.html", dateDifference=timeDiffArray, user=current_user)

@views.route('/pantry', methods=['GET', 'POST'])
@login_required
def pantry():
    d1 = db.session.query(food_items.expiry).filter_by(user_id = current_user.id).order_by(food_items.expiry).all()
    timeDiffArray = []    
    for dates in d1:
        if dates is not None:
            newdate = dates
            print(dates)
        d = newdate[0]
        t = datetime.strptime(d, '%Y-%m-%d')
        t2 = datetime.now()
        delta = t - t2
        days = delta.days
        timeDiff = str(days)
        timeDiffArray.append(timeDiff)
        print(timeDiffArray)

    if request.method == 'POST':
        food_title = request.form.get('food_title')
        amount = request.form.get('amount')
        unit = request.form.get('unit')
        expiry = request.form.get('expiry')
        new_item = food_items(food_title = food_title, amount = amount,  expiry = expiry, user_id = current_user.id, unit=unit)
        db.session.add(new_item)
        db.session.commit()

    return render_template("pantry.html", dateDifference=timeDiffArray, user=current_user)

@views.route('/recipes', methods=['GET', 'POST'])
@login_required
def recipes():
    return render_template('recipes.html', user=current_user)

@views.route('/recipe', methods=['GET', 'POST'])
@login_required
def recipe():
    if request.method == 'POST':
        items = request.form.getlist('ingredient')
        for items in items:
            item = items
            new_item = shopping_list(item = item, user_id = current_user.id)
            db.session.add(new_item)
            db.session.commit()

    return render_template('recipe_page.html', user=current_user)

@views.route('/shopping', methods=['GET', 'POST'])
@login_required
def shopping():
    if request.method == 'POST':
        food_title = request.form.get('food_title')
        amount = request.form.get('amount')
        unit = request.form.get('unit')
        expiry = request.form.get('expiry')
        new_item = food_items(food_title = food_title, amount = amount,  expiry = expiry, user_id = current_user.id, unit=unit)
        db.session.add(new_item)
        db.session.commit()
        print('item added successfully')
    return render_template("shopping.html", user=current_user)
